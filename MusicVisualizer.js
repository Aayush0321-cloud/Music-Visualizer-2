const fileInput = document.getElementById('audiofile');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioCtx, analyser, source, bufferLength, dataArray;

fileInput.onchange = function() {
    const file = this.files[0];
    if (!file) return;

    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.controls = true;
    audio.autoplay = true;
    document.body.appendChild(audio);

    audioCtx = new (window.AudioContext || window.webkitAudioCOntext)();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    draw();
};

function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const gradient = ctx.createLinearGradient(0,0,0, canvas.height);
        gradient.addColorStop(0, "#ff00ff");
        gradient.addColorStop(0.5, "#00ffff");
        gradient.addColorStop(1, "#ff9900");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "#ff00ff";
        ctx.shadowBlur = 20;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
    }

}

