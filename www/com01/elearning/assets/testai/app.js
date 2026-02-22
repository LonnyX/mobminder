
let pcmPlayerProcessorModuleFileName = 'pcmPlayerProcessor.js';
let pcmRecorderProcessorModuleFileName = 'pcmRecorderProcessor.js';

const EVadClient = {
  VAD: 'vad',
  PUSH: 'push',
  CONTINU: 'continu'
};

let vadclient;
let vadserver;

if (vadmode=='vad'){ //VAD
  vadclient=EVadClient.VAD;   //enable client side = VAD
  vadserver=false;            //enable server side VAD = false
}
else if (vadmode=='push'){ //PUSH TO TALK
  vadclient=EVadClient.PUSH;  //enable client side  = PUSH TO TALK
  vadserver=false;            //enable server side VAD = false
}
else{ //CONTINU
  vadclient=EVadClient.CONTINU;   //enable client side VAD = true (VAD or push to talk)
  vadserver=true;            //enable server side VAD = false
}

let frameSize= 256;             //size of frame recorded by AudioWorkletProcessor (fixed size)
let sampleRate= 24000;          //audio stream sample rate
let silencedurationms = 500;    //how long silence must last before declaring speech has stopped.
let voiceStartMinMs = 500;      //how long speech must continue before confirming someone is talking.

let websocketframeSize= 512;    //size of frame send to gtw
let buffermaxframe =  Math.round(voiceStartMinMs / 1000 * sampleRate / websocketframeSize); // maxFrames: how many recent frames to keep (default: 33). 
                                                                      // 0.5 seconds à 24kHz / 512 = 23.5 frames
let threshold = 0.02;           //the volume level to consider something as speech.
let targetRMS = 0.05;           //the desired average loudness.

let socket;                     //gtw websocket

let audioContextRecorder;       //audiocontect for listening voice
let workletNodeRecorder;        //audioworklet for listening voice
let streamRecorder;

let audioContextPlayer;         //audiocontext for playing AI stream
let workletNodePlayer;          //audioworklet for playing AI stream

let aiisready;                  //set to true when openAI is ready for talking. prevent starting mute if ai is not readdy
var VadTalkingDetected;

//initialize button displayed or not
document.getElementById('start').style.display = 'flex';
document.getElementById('stop').style.display = 'none';

if (vadclient==EVadClient.VAD){
  //if client VAD => hide push to talk button
  document.getElementById('push').style.display = 'none';
}
else if (vadclient==EVadClient.PUSH){
  //if not client VAD => display mute button
  document.getElementById('mute').style.display = 'none';
  document.getElementById('reply').style.display = 'none';
}
else { //CONTINU
  document.getElementById('push').style.display = 'none';
  document.getElementById('mute').style.display = 'none';
  document.getElementById('reply').style.display = 'none';
}

//close GTW session when user switches browser tab
window.addEventListener('visibilitychange', function () {
  console.log('visibilitychange!');
  stopSession();
});

document.getElementById('start').addEventListener('click', () => { startSession();});
document.getElementById('stop').addEventListener('click', () => { stopSession();});
document.getElementById('reply').addEventListener('click', () => { forceReply();});

//handle tap and mouse event (down & up) on push button
document.getElementById('push').addEventListener('mousedown', () => { startRecording();});
document.getElementById('push').addEventListener('touchstart', () => { startRecording();});
document.getElementById('push').addEventListener('mouseup', () => { stopRecording(); });
document.getElementById('push').addEventListener('touchend', () => { stopRecording(); });

//handle tap and mouse event (down & up) on mute button
document.getElementById('mute').addEventListener('mousedown', () => { startMute();});
document.getElementById('mute').addEventListener('touchstart', () => { startMute();});
document.getElementById('mute').addEventListener('mouseup', () => { stopMute(); });
document.getElementById('mute').addEventListener('touchend', () => { stopMute(); });

const deviceList = document.getElementById('deviceList');
    
navigator.mediaDevices.enumerateDevices().then(devices => {
      devices.forEach(device => {
        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        const li = document.createElement('li');
        li.textContent = `${device.kind} : ${device.label || '(label masqué)'} | ID: ${device.deviceId}`;
        deviceList.appendChild(li);
      });
});


//start GTW AI websocket session //////////////////////////////////////////////////////////////////
async function startSession() {
  try {

    if (socket!=null) {
      console.log('starting session not allowed!');
      return;
    }

    aiisready=false;

    //check if WebRTC is supported by browser
    console.log('starting session...');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      let errormsg ='WebRTC is not supported by browser.'; 
      console.error(errormsg);
      alert(errormsg);
      return;
    }

   

    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'flex';

    console.log('testmode='+testmode);
    if (testmode==1){
      //access to DEV gtw (local)
      socket = new WebSocket('ws://192.168.0.16:5050/testrealtime');
    }
    else{
      //connect to gtw
      socket = new WebSocket('wss://gtw01.mobminder.com:5062/testrealtime'); //5062!!
    }
    //not used
          //socket = new WebSocket('wss://192.168.0.11:5051/testrealtime');
          //socket = new WebSocket('ws://91.134.44.204:5050/testrealtime');
          
    socket.onopen = async () => {
      console.log('WebSocket connected !');

      try {
        //initialize audio player
        audioContextPlayer = new AudioContext({ sampleRate: sampleRate });
        await audioContextPlayer.audioWorklet.addModule(pcmPlayerProcessorModuleFileName);
        workletNodePlayer = new AudioWorkletNode(audioContextPlayer, 'pcm-player');
        workletNodePlayer.connect(audioContextPlayer.destination);
      
        //initialize audio recorder
        audioContextRecorder = new AudioContext({ sampleRate: sampleRate });
        await audioContextRecorder.audioWorklet.addModule(pcmRecorderProcessorModuleFileName);
        streamRecorder = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source1 = audioContextRecorder.createMediaStreamSource(streamRecorder);
        workletNodeRecorder = new AudioWorkletNode(audioContextRecorder, 'pcm-recorder');
        source1.connect(workletNodeRecorder).connect(audioContextRecorder.destination);

        //global recording audio buffer
        let buffer = new Float32Array();
        
        //global flag to know if VAD controller has detected speaking or silence
        console.log('VadTalkingDetected set to false');
        VadTalkingDetected=false;

        //circular audio buffer, used to send a little speaking audio recored before on voice start event
        const circularBuffer = new CircularAudioBuffer(buffermaxframe); 

        //initialize Gain compensator
        const gaincompensator = new GainCompensator(targetRMS);

        //initialize VAD controller
        let vadcontroller;
        if (vadclient==EVadClient.VAD){
          vadcontroller = new VADController({
            sampleRate: sampleRate,
            frameSize: frameSize,
            silenceDurationMs: silencedurationms,
            voiceStartMinMs: voiceStartMinMs,
            threshold: threshold // ajuste selon ton setup 0.008
          });

          //VAD controlleur on voice START handler
          vadcontroller.onVoiceStart = () => {
            console.log('voice has been detected');

            //send cancelResponse command to gtw
            let cancelResponse = { action : 'cancelResponse'};
            let json = JSON.stringify(cancelResponse);
            console.log('requesting cancelResponse...');
            socket.send(json);

            //clear audio player buffer
            if (!vadserver) workletNodePlayer.port.postMessage('clear');

            //send circular buffer content to gtw, it contains
            const bufferedFrames = circularBuffer.flush();
            console.log('bufferedFrames.size='+bufferedFrames.length);
            bufferedFrames.forEach(frame => {
              //convert float32 to uint8
              let uint8Array = float32ToUint8(frame);
              console.log('sending buffered data uint8Array='+uint8Array.length+'/'+uint8Array.byteLength);
              //uint8Array = addHeaderToUint8Array(2, uint8Array);
              //send circular buffer to gtw
              socket.send(uint8Array.buffer);
            });

            //allows real-time record streaming to be sent to gtw
            VadTalkingDetected=true;
          };
          
          //VAD controlleur on voice END handler
          vadcontroller.onVoiceEnd = () => {
            console.log('silence has been detected');

            //prevent real-time record streamgin to be sent to gtw
            VadTalkingDetected=false;

            //send createResponse command to gtw
            if (!vadserver){
              console.log('AI:requesting createResponse...');
              let createResponse = { action : 'createResponse'};
              let json = JSON.stringify(createResponse);
              console.log('requesting createResponse...');
              socket.send(json);
            }
          };
        }
        /*else if (vadclient==EVadClient.CONTINU){
          VadTalkingDetected=true;
        }*/

        workletNodePlayer.port.onmessage = (event) => {
          if (event.data.type === 'output-empty') {
            console.log('AI : audio stream is stopped');
            if (vadclient==EVadClient.VAD || vadclient==EVadClient.CONTINU){
              workletNodeRecorder.port.postMessage('start');
            }
          } 
          else if (event.data.type === 'output-resumed') {
            console.log('AI : audio stream is started');
            if (vadclient==EVadClient.VAD || vadclient==EVadClient.CONTINU){
              workletNodeRecorder.port.postMessage('stop'); 
            }

          }
        };


        //audio recorder message handler : listen voice recording and send it to gtw
        workletNodeRecorder.port.onmessage = (event) => {
          
          //stream correction by gain compensator
          const float32Array = gaincompensator.process(event.data);

          //call VAD algorithm for detecting voice and silence => it forces VadTalkingDetected flag to true/false
          if (vadclient==EVadClient.VAD) {
            vadcontroller.process(float32Array);
          }

          //concatenate current event.data stream to global buffer stream
          let newbuffer = new Float32Array(buffer.length + event.data.length);
          newbuffer.set(buffer, 0);
          newbuffer.set(event.data, buffer.length); 
          buffer = newbuffer;

          //default packet size = 256
          //latence basse mais perf réseau meilleure → batch tous les 2 quantums (256 samples, 1024 bytes)
          if (buffer.length==512)
          {
            circularBuffer.push(buffer);

            if (VadTalkingDetected)
            {
              //convert float32 to uint8
              let uint8Array = float32ToUint8(buffer);

              //reset global buffer
              buffer = new Float32Array();

              console.log('USER : sending data...uint8Array='+uint8Array.length+'/'+uint8Array.byteLength);
              //uint8Array = addHeaderToUint8Array(2, uint8Array);
              //send recording stream to gtw
              socket.send(uint8Array.buffer);
              
              //test : direct play recording voice : workletNodePlayer.port.postMessage(float32Array);
            }
            else //not VadTalkingDetected = silence
            {
              console.log('USER : silence');
              //reset global buffer
              buffer = new Float32Array();
            }
          }

        };
        
        interruptresponse = (interruptresponse=='1'?true:false);

        switch (eagerness){
          case 'l' : eagerness='low'; break;
          case 'h' : eagerness='high'; break;
          default  : eagerness='auto'; break;
        }

        switch(inputaudionoisereduction){
          case 'n' : inputaudionoisereduction = 'near_field'; break;
          case 'f' : inputaudionoisereduction = 'far_field'; break;
          default : inputaudionoisereduction = null; break;
        }

        console.log('interruptresponse='+interruptresponse);
        console.log('eagerness='+eagerness);
        console.log('inputaudionoisereduction='+inputaudionoisereduction);
        
        //let mode = findGetParameter('mode'); 
        if (mode=='assistant') //mode assistant ///////////////////////////////////////////////////////////////////////////
        {
          console.log('mode=assistant');
          //get mobminder credentials from url
          //let lgn = findGetParameter('lgn');
          //let pwd = findGetParameter('pwd');
          //let kid = findGetParameter('kid');
          //let rsid = findGetParameter('rsid');
          //let gender = findGetParameter('gender');
          
          //send AI initialization parameters to gtw
          let connectToIaConfig = {
            action : 'connectToIa', //action = connect to IA
            lgn : lgn,
            pwd : pwd,
            kid : kid,
            resourceid : rsid,
            gender: gender,
            vad : (vadserver? true:false),    //enable vad mode (false =push-to-talk)
            booking : false,
            interruptresponse:interruptresponse,
            eagerness:eagerness,
            inputaudionoisereduction:inputaudionoisereduction
          };
          let connectToIaJson = JSON.stringify(connectToIaConfig);
          console.log('requesting connectToIa...');
          socket.send(connectToIaJson);
        }
        else { //mode booking ///////////////////////////////////////////////////////////////////////////////////////
          console.log('mode=booking');
          
          //get mobminder credentials from url
          //let lgn = findGetParameter('lgn'); //TMP
          //let pwd = findGetParameter('pwd'); //TMP
          //let kid = findGetParameter('kid');
          //let postfixurl = findGetParameter('postfixurl');
          //let lastname = findGetParameter('lastname');
          //let firstname = findGetParameter('firstname');
          //let mobile = findGetParameter('mobile');
          //let birthday = findGetParameter('birthday');
          
          //send AI initialization parameters to gtw
          let connectToIaConfig = {
            action : 'connectToIa', //action = connect to IA
            lgn : lgn,
            pwd : pwd,
            kid:kid,
            postfixurl : postfixurl,
            lastname : lastname,
            firstname : firstname,
            mobile : mobile,
            birthday : birthday,
            vad : (vadserver? true:false),    //enable vad mode (false =push-to-talk)
            booking : true,
            interruptresponse:interruptresponse,
            eagerness:eagerness,
            inputaudionoisereduction:inputaudionoisereduction
          };
          let connectToIaJson = JSON.stringify(connectToIaConfig);
          console.log('requesting connectToIa...');
          //await new Promise(resolve => setTimeout(resolve, 1000));
          socket.send(connectToIaJson);
        }
        console.log('AI connected');

      } catch (error) {
        console.error('error :', error);
        stopSession();
      }
    } 
    socket.onerror = (error) => {
      console.error('WebSocket error :', error);
      stopSession();
    }
    socket.onclose = () => {
      console.log('WebSocket close.');
      stopSession();
    }
    //gtw socket event handler
    socket.onmessage = async (event) => {
      
      //receiving audio stream and send it to audio player --------------------------------------------------------------
      if (event.data instanceof Blob) { 
        let arrayBuffer = await event.data.arrayBuffer(); // Convertir Blob en ArrayBuffer
        let uint8Array = new Uint8Array(arrayBuffer); // Transformer ArrayBuffer en Uint8Array
        console.log('receiving data uint8Array= '+uint8Array.length+'/'+uint8Array.byteLength);//+event.data);
        let int16Array = new Int16Array(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength / Int16Array.BYTES_PER_ELEMENT);
        let float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 32768.; 
        }

        workletNodePlayer.port.postMessage(float32Array);
      }
      else //receiving json status from gtw
      {
        const response = JSON.parse(event.data);
        if (response.status=='ready') //message = IA connection ready response -----------------------------------------
        {
          console.log('received message : status=ready => AI is ready');
          if (vadclient==EVadClient.VAD || vadclient==EVadClient.CONTINU) workletNodeRecorder.port.postMessage('start');
          aiisready=true;

          if (vadclient==EVadClient.CONTINU){
            console.log('VadTalkingDetected set to true');
            VadTalkingDetected=true;
          }
        }
        else if (response.status=='interrupted') //message = AI speaking has been interrupted by USER
        {
          console.log('received message : status=interrupted');
          workletNodePlayer.port.postMessage('clear');
        }
        else if (response.status=='error') //any error from gtw --------------------------------------------------------
        {
          console.log('received message : status=error, detail='+response.error);
          stopSession();
        }
        else //other status = invalid status ---------------------------------------------------------------------------
        {
          console.log('received message : other status ='+response.status);
          //stopSession();
        }
      }
    };
  } catch (error) {
      console.error('error :', error);
      stopSession();
  }
}

//stop current session, clean up peer connection and data channel ////////////////////////////////
function stopSession() {
  /*if (socket==null) {
    console.log('stopping session not allowed!');
    return;
  }*/

  console.log('stopping session...');

    document.getElementById('start').style.display = 'flex';
    document.getElementById('stop').style.display = 'none';


  if ((vadclient==EVadClient.VAD || vadclient==EVadClient.CONTINU) && workletNodeRecorder) workletNodeRecorder.port.postMessage('stop');

  if (streamRecorder) streamRecorder.getTracks().forEach(track => track.stop())
  streamRecorder=null;

  if (workletNodePlayer) workletNodePlayer.disconnect();
  workletNodePlayer=null;
  if (audioContextPlayer) audioContextPlayer.close();
  audioContextPlayer=null;
  
  if (workletNodeRecorder) workletNodeRecorder.disconnect();
  workletNodeRecorder=null;
  if (audioContextRecorder) audioContextRecorder.close();
  audioContextRecorder=null;

  if (socket) socket.close();
  socket=null;

  aiisready=false;

  console.log('session stopped');

}

//start recording, only used by client push to talk mode (not used anymore) //////////////////////
async function startRecording() {
  if (vadclient==EVadClient.VAD || vadclient==EVadClient.CONTINU) return;

  if (socket==null) {
    console.log('start recording not allowed! (socket is null)');
    return;
  }

  if (!aiisready){
    console.log('start recording not allowed! (AI is not ready)');
    return; 
  }

  document.getElementById('push').style.backgroundColor = 'orange';


  console.log('AI:requesting cancelResponse...');
  let cancelResponse = { action : 'cancelResponse'};
  let cancelResponseJson = JSON.stringify(cancelResponse);
  console.log('requesting cancelResponse...');
  socket.send(cancelResponseJson);

  //clear audio player buffer
  //cela n'a rien changé, c'est pas top top
  if (!vadserver){
    console.log('clearing audio player buffer...');
    workletNodePlayer.port.postMessage('clear');
  }

  VadTalkingDetected = true;
  workletNodeRecorder.port.postMessage('start');
}

//stop recording, only used by client push to talk mode (not used anymore) ///////////////////////
async function stopRecording(){
  if (vadclient==EVadClient.VAD || vadclient==EVadClient.CONTINU) return;

  
  if (socket==null) {
    console.log('stop recording not allowed! (socket is null)');
    return;
  }

  if (!aiisready){
    console.log('stop recording not allowed! (AI is not ready)');
    return; 
  }

  document.getElementById('push').style.backgroundColor = '#28a745';

  workletNodeRecorder.port.postMessage('stop');
  VadTalkingDetected = false;

  console.log('AI:requesting createResponse...');
  let createResponse = { action : 'createResponse'};
  let createResponseJson = JSON.stringify(createResponse);
  console.log('requesting createResponse...');
  socket.send(createResponseJson);
}

//start mute microphone, only used by client vad mode ///////////////////////////////////////////
async function startMute() {
  if (vadclient!=EVadClient.VAD) return;

  if (socket==null) {
    console.log('start mute not allowed! (socket is null)');
    return;
  }

  if (!aiisready){
    console.log('start mute not allowed! (AI is not ready)');
    return; 
  }



  document.getElementById('mute').style.backgroundColor = '#ea6a6f';
  workletNodeRecorder.port.postMessage('stop');
}

//stop mute microphone, only used by client VAD mode ////////////////////////////////////////////
async function stopMute(){
  if (vadclient!=EVadClient.VAD) return;

  if (socket==null) {
    console.log('stop mute not allowed!');
    return;
  }

  document.getElementById('mute').style.backgroundColor = '#555';
  workletNodeRecorder.port.postMessage('start');
}

//force AI to replay, only used by client vad mode ///////////////////////////////////////////
async function forceReply() {
  if (vadclient!=EVadClient.VAD) return;

  if (socket==null) {
    console.log('force reply not allowed! (socket is null)');
    return;
  }

  if (!aiisready){
    console.log('force reply not allowed! (AI is not ready)');
    return; 
  }

  /*console.log('AI:force reply => requesting createResponse...');
  let createResponse = { action : 'createResponse'};
  let json = JSON.stringify(createResponse);
  console.log('requesting createResponse...');
  socket.send(json);*/

  console.log('AI:force reply => requesting sendUserMessageContent...');
  let sendUserMessageContent = { action : 'sendUserMessageContent', text: 'could you repeat please?'};
  let json = JSON.stringify(sendUserMessageContent);
  //console.log('requesting sendUserMessageContent...');
  socket.send(json);

  

}

//convert float32 array audio streaming to uint8 array //////////////////////////////////////////
function float32ToUint8(float32Array) {
  let uint8Array = new Uint8Array(float32Array.length * 2+1);
  
  //add header int value at the beginning of stream array
  uint8Array[0]=2;

  for (let i = 0; i < float32Array.length; i++) {
    // Clamp the sample value to the range [-1, 1]
    const sample = Math.max(-1, Math.min(1, float32Array[i]));
    // Scale to 16-bit signed integer range and convert
    let outputBuffer = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    uint8Array[i * 2 + 1] = outputBuffer & 0xFF;            // low octet
    uint8Array[i * 2 + 2] = (outputBuffer >> 8) & 0xFF; // hight Octet
  }
  return uint8Array;
}

//get parameter from URL /////////////////////////////////////////////////////////////////////
function findGetParameter(parameterName) {
  var result = null,
      tmp = [];
  location.search
      .substr(1)
      .split('&')
      .forEach(function (item) {
        tmp = item.split('=');
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
  return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//The VADController class is a simple voice activity detector (VAD). 
//It processes audio frames and detects when someone starts and stops speaking, based on the loudness (RMS energy) of the signal.
//How it works:
//- It analyzes each frame's volume level (RMS).
//- If the volume exceeds a certain threshold, it considers it speech.
//- It tracks how many consecutive speech or silence frames occur.
//- When there's enough speech, it triggers onVoiceStart().
//- When there's enough silence, it triggers onVoiceEnd().
//Main components:
//- threshold: the volume level to consider something as speech.
//- voiceStartMinMs: how long speech must continue before confirming someone is talking.
//- silenceDurationMs: how long silence must last before declaring speech has stopped.
//- process(frame): called repeatedly with audio data to update detection state.
//////////////////////////////////////////////////////////////////////////////////////////////
class VADController {
  constructor({
    sampleRate = 24000,
    frameSize = 720,
    silenceDurationMs = 1000,
    voiceStartMinMs = 500,
    threshold = 0.01
  }) {
    this.sampleRate = sampleRate;
    this.frameSize = frameSize;
    this.threshold = threshold;

    this.framesPerSecond = Math.floor(sampleRate / frameSize);

    this.maxSilenceFrames = Math.floor(silenceDurationMs / (1000 / this.framesPerSecond));
    this.minVoiceFrames = Math.floor(voiceStartMinMs / (1000 / this.framesPerSecond));

    this.silenceCount = 0;
    this.voiceCount = 0;
    this.speaking = false;

    this.onVoiceStart = () => {};
    this.onVoiceEnd = () => {};
  }

  process(frame) {
    const rms = this._computeRMS(frame);
    const isSpeech = rms > this.threshold;

    if (isSpeech) {
      this.silenceCount = 0;
      this.voiceCount++;

      if (!this.speaking && this.voiceCount >= this.minVoiceFrames) {
        this.speaking = true;
        this.onVoiceStart(); //Début confirmé
      }
    } else {
      this.voiceCount = 0;

      if (this.speaking) {
        this.silenceCount++;
        if (this.silenceCount >= this.maxSilenceFrames) {
          this.speaking = false;
          this.silenceCount = 0;
          this.onVoiceEnd(); //Fin de parole
        }
      }
    }
  }

  _computeRMS(frame) {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) {
      sum += frame[i] * frame[i];
    }
    return Math.sqrt(sum / frame.length);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//A Rolling Audio Frame Buffer
//The CircularAudioBuffer class is a simple circular (or rolling) buffer that stores a limited number of recent audio frames.
//How it works:
//It keeps up to maxFrames audio frames in memory.
//- When a new frame is pushed and the buffer is full, it automatically discards the oldest one (FIFO: first in, first out).
//- The flush() method returns all buffered frames and resets the buffer.
//Main components:
//- maxFrames: how many recent frames to keep (default: 33).
//- push(frame): adds a new frame and manages the buffer size.
//- flush(): returns all current frames and clears the buffer.
//////////////////////////////////////////////////////////////////////////////////////////////
class CircularAudioBuffer {
  constructor(maxFrames = 33) {
    this.maxFrames = maxFrames;
    this.buffer = [];
  }

  push(frame) {
    this.buffer.push(frame); // copier le frame
    if (this.buffer.length > this.maxFrames) {
      this.buffer.shift(); // garder que les plus récents
    }
  }

  flush() {
    const out = this.buffer;
    this.buffer = [];
    return out;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//The GainCompensator class performs real-time volume normalization. It dynamically adjusts the gain of an audio signal to maintain a consistent target RMS (volume level).
//How it works:
//- Calculates the RMS (average energy) of each audio frame.
//- Determines the required gain to reach the desired targetRMS.
//- Caps the gain at maxGain to avoid overly loud output.
//- Smooths the gain over time using a smoothing factor, so volume changes aren’t abrupt.
//- Applies the computed gain to each sample in the frame.
//Key parameters:
//- targetRMS: the desired average loudness.
//- maxGain: maximum allowed gain (for safety).
//- smoothing: how gradually the gain is adjusted between frames (0 = instant, 1 = very smooth).
//////////////////////////////////////////////////////////////////////////////////////////////
class GainCompensator {
  constructor(targetRMS = 0.05, maxGain = 10, smoothing = 0.9) {
    this.targetRMS = targetRMS;
    this.maxGain = maxGain;
    this.smoothing = smoothing;
    this.previousGain = 1.0;
  }

  computeRMS(frame) {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) {
      sum += frame[i] * frame[i];
    }
    return Math.sqrt(sum / frame.length);
  }

  process(frame) {
    const rms = this.computeRMS(frame);
    if (rms === 0) return frame; // silence

    let gain = this.targetRMS / rms;

    // Limite du gain pour éviter les abus
    gain = Math.min(gain, this.maxGain);

    // Lissage du gain pour éviter les sauts
    gain = this.smoothing * this.previousGain + (1 - this.smoothing) * gain;
    this.previousGain = gain;

    //console.log('gain='+gain);

    // Application du gain
    const compensated = new Float32Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      compensated[i] = frame[i] * gain;
    }

    return compensated;
  }
}

/*function addHeaderToInt16Array(value, int16Array) {
  const newArray = new Int16Array(int16Array.length + 1);
  newArray[0] = value; // Insérer la nouvelle valeur au début
  newArray.set(int16Array, 1); // Copier l'ancien tableau après
  return newArray;
}*/

