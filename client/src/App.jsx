import React, { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function App() {


  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log("messages :", messages);

  // const socket = io('http://localhost:3000');// we can't use it like this  because socket is changing every time 

  const socket = useMemo(() => io('http://localhost:3000'), []);



  useEffect(() => {
    // Set up the socket connection and listen for events when the component mounts
    socket.on("connect", () => {
      console.log("connected:");
      setSocketId(socket.id)
      console.log("socket id:", socket.id);
    });

    // Listen for 'welcome' message from the server
    socket.on("welcome", (message) => {
      console.log(message);
    });


    socket.on("message-recieve", (message) => {
      console.log(message)
      setMessages((messages) => [...messages, message])
      // console.log([...data]);
    })

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
      console.log("Disconnected from server");
    };
  }, []); // Empty dependency array to run the effect only once


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("e", message);
    socket.emit("message", { message, room })// for sending data in the backend
    setMessage("")
    setRoom("");
  }

  const joinSubmit = (e) => {
    e.preventDefault();
    console.log("room name :",roomName);
    socket.emit("join-room",roomName);
    
  }


  return (
    <Container maxWidth="sm" className='h-screen'>
      <Box sx={{ height: 500 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socket.id}
      </Typography>

       <form onSubmit={joinSubmit} >
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) =>setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form> 

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

       <Stack>
        {messages?.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack> 
    </Container>
  );
}

export default App;
