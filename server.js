const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let boardState = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Send the current board state to the new client
    socket.emit('boardState', boardState);

    // Listen for drawing events from clients
    socket.on('draw', (data) => {
        boardState.push(data); // Store drawing data
        socket.broadcast.emit('draw', data); // Send to all other clients
    });

    // Handle board clear event
    socket.on('clear', () => {
        boardState = [];
        io.emit('clear'); // Inform all clients to reset
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
