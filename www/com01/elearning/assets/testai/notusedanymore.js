
function generatePCM16Sound(frequency = 440, durationMs = 1000, sampleRate = 24000) {
    const totalSamples = Math.floor((durationMs / 1000) * sampleRate); // Nombre total d'échantillons
    const pcm16Array = new Int16Array(totalSamples);
    
    for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate; // Temps courant
        const amplitude = 0.8 * 32767; // 80% de l'amplitude maximale
        pcm16Array[i] = Math.round(amplitude * Math.sin(2 * Math.PI * frequency * t)); // Sinusoïde
    }
    
    return pcm16Array;
  }
  
  function swapEndian(int16Array) {
    let swapped = new Int16Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
        let value = int16Array[i];
        swapped[i] = ((value & 0xFF) << 8) | ((value >> 8) & 0xFF); // Inversion des octets
    }
    return swapped;
  }
  
  function isLittleEndian() {
    let buffer = new ArrayBuffer(2);
    let view = new DataView(buffer);
    view.setUint16(0, 0x1234);
    return view.getUint8(0) === 0x34; // Vérifie si le premier octet est le moins significatif
  }
  
  