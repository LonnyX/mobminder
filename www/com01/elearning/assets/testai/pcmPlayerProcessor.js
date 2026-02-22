/*
When playing sound, AudioWorkletProcessor lets you generate or modify audio samples manually in real time. 
Instead of just playing a preloaded file (like with AudioBufferSourceNode), you're creating audio sample-by-sample — 
which gives you full control over the sound.
source = https://stackoverflow.com/questions/36482348/how-can-i-play-pcm-audio-i-receive-from-a-websocket-stream*/
class PcmPlayerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Float32Array();
        
        this.silentFrames = 0;
        this.maxSilentFrames = 20; // 

        this.port.onmessage = (event) => {
            if (event.data === 'clear') { //postmessage('clear') to reset the streaming buffer (used when AI is interrupted by user)////////

                console.log('player : clear buffer');
                this.buffer = new Float32Array();
            }
            else{ //postmessage(Float32Array) to play audio streaming///////////////////////////////////////////////////////////////////////

                // Receive audio data from the main thread, and add it to the buffer
                let newFetchedData = new Float32Array(this.buffer.length + event.data.length);
                newFetchedData.set(this.buffer, 0);
                newFetchedData.set(event.data, this.buffer.length); 
                this.buffer = newFetchedData;
            }
        };
    }

    // Take a chunk from the buffer and send it to the output to be played
    process(inputs, outputs, parameters) { 
        const output = outputs[0];
        const channel = output[0];

        let isSilent = true;

        const bufferLength = this.buffer.length;
        for (let i = 0; i < channel.length; i++) {
            channel[i] = (i < bufferLength) ? this.buffer[i] : 0;

            if (Math.abs(channel[i]) > 1e-5) {
                isSilent = false;
                //console.log('isSilent set to false');
                //break;
            }
        }

        this.buffer = this.buffer.slice(channel.length);

        if (isSilent) {
            this.silentFrames++;
            if (this.silentFrames === this.maxSilentFrames) {
                this.port.postMessage({ type: 'output-empty' });
            }
        } else {
        
            if (this.silentFrames >= this.maxSilentFrames) {
                this.port.postMessage({ type: 'output-resumed' });
            }
            this.silentFrames = 0;
        }

        return true;
    }
}

registerProcessor('pcm-player', PcmPlayerProcessor);

