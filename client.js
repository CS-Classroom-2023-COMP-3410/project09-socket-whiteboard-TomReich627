const socket = io('http://localhost:3000');

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearBoard');
const colorPicker = document.getElementById('colorPicker');

let drawing = false;
let color = '#000000';

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    socket.emit('draw', { x, y, color });
}

socket.on('draw', (data) => {
    ctx.strokeStyle = data.color;
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

clearButton.addEventListener('click', () => {
    socket.emit('clear');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
});
