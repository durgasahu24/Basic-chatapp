import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken'

const app = express();
const PORT = 3000;
const server = http.createServer(app);

// Setting up the socket.io server with CORS settings
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow the client at localhost:5173
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const user = true;

io.use((socket,next) => {  // middleware for socket
  console.log("socket middleware");
  if(user) next();
})


// Handling socket connections
io.on('connection', (socket) => {
  console.log('User connected:');
  console.log('Id:', socket.id);

  // Example to send data to every connected socket
  // socket.emit('welcome', `Welcome to the server ${socket.id}`);
  // socket.broadcast.emit('welcome', `${socket.id} joined the server`);


  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected with ID: ${socket.id}`);
  });


  socket.on("message", (data) => {
    console.log(data);
    // io.emit("message-recieve",data);// for sending data to every socket
    // socket.broadcast.emit("message-recieve", data);// data will go every socket except this one
    // io.to(data.room).emit("message-recieve",data.message);// data will go to the specifil room only 
    socket.to(data.room).emit("message-recieve",data.message);// it will also work same as abov
  })

  socket.on("join-room", (room) => {
    console.log("welcome to joom room ",room);
    socket.join(room);
    console.log("user connected in room name  ", room)
  })


});


// Using CORS middleware to allow cross-origin requests from the client
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from localhost:5173
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

// Starting the server on the specified port
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// A simple route to confirm the server is up
app.get('/', (req, res) => {
  res.send('Hello World');
});
