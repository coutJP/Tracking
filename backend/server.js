const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up a Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit the user's location data when it changes
  socket.on('updateLocation', (data) => {
    io.emit('location', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
