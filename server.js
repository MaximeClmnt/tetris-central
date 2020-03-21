'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const app = express();
const server = app.use((req, res) => res.sendFile(INDEX, { root: __dirname }));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
app.use(express.static(__dirname));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('click',(val) => console.log(val));
  socket.on('disconnect', () => console.log('Client disconnected'));
});


setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
