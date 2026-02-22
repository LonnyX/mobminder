/*
AudioWorkletProcessor is a key part of the AudioWorklet API, which allows you to process audio in real time in the browser, directly inside the audio rendering thread — meaning very low latency.
It’s a class you define to handle raw audio data frame by frame (sample by sample). You can use it to implement custom audio logic that isn’t covered by the built-in Web Audio nodes.
To define custom audio processing code you have to derive a class from the AudioWorkletProcessor interface. 
Although not defined on the interface, the deriving class must have the process method. This method gets 
called for each block of 128 sample-frames and takes input and output arrays and calculated values of custom 
AudioParams (if they are defined) as parameters. You can use inputs and audio parameter values to fill the 
outputs array, which by default holds silence.
source=https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor*/
class PcmRecorderProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.isMuted = true; //micro is off as default value
  
      this.port.onmessage = (event) => {
        if (event.data === 'start') {  //postmessage('start') to start listening/////////////////////////////////////

          this.isMuted = false;
        }
        else if (event.data === 'stop') { //postmessage('stop') to stop listening////////////////////////////////////

            this.isMuted = true;
          }
      };
    }
  
    process(inputs) {
      //ismuted => no streaming
      if (this.isMuted) return true;

      const input = inputs[0];
      if (!input || input.length === 0) return true;
  
      // first channel = mono
      const float32Array = input[0];
  
      // send data to main thread
      this.port.postMessage(float32Array);

      return true;
    }
  }
  
  registerProcessor('pcm-recorder', PcmRecorderProcessor);
  