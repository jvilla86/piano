const NOTES = {
    "C": 261.63, "Db": 277.18, "D": 293.66, "Eb": 311.13,
    "E": 329.63, "F": 349.23, "Gb": 369.99, "G": 392.00,
    "Ab": 415.30, "A": 440.00, "Bb": 466.16, "B": 493.88
};

const keyboardMap = {
    'a': 'C', 'w': 'Db', 's': 'D', 'e': 'Eb', 'd': 'E',
    'f': 'F', 't': 'Gb', 'g': 'G', 'y': 'Ab', 'h': 'A',
    'u': 'Bb', 'j': 'B'
};

let audioCtx = null;

// Inicializar el contexto de audio
document.getElementById('start-btn').addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        document.getElementById('start-btn').innerText = "Piano Activo";
        document.getElementById('start-btn').style.background = "#28a745";
    }
});

function playNote(frequency, noteName) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; // Un sonido más cálido que el 'sine'
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
}

// Eventos de ratón
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        playNote(NOTES[note]);
        key.classList.add('active');
    });
    key.addEventListener('mouseup', () => key.classList.remove('active'));
    key.addEventListener('mouseleave', () => key.classList.remove('active'));
});

// Eventos de teclado físico
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keyboardMap[key]) {
        const noteName = keyboardMap[key];
        const element = document.querySelector(`[data-note="${noteName}"]`);
        
        // Evitar repetición molesta si se mantiene pulsada la tecla
        if (element && !element.classList.contains('active')) {
            playNote(NOTES[noteName]);
            element.classList.add('active');
        }
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keyboardMap[key]) {
        const noteName = keyboardMap[key];
        const element = document.querySelector(`[data-note="${noteName}"]`);
        if (element) element.classList.remove('active');
    }
});
