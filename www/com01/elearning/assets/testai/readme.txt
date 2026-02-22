- install
npm install -g javascript-obfuscator

- batch run_objscator.bat
    javascript-obfuscator pcmPlayerProcessor.js --output pcmPlayerProcessor.obf.js
    javascript-obfuscator PcmRecorderProcessor.js --output PcmRecorderProcessor.obf.js
    javascript-obfuscator app.js --output app.obf.js

- use obfuscated code
    - index.html : call app.js/app.obf.js
    - app.js : call pcmPlayerProcessor.js/pcmPlayerProcessor.obj.js
                    pcmRecorderProcessor.js/pcmRecorderProcessor.obf.js