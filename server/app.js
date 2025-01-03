import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors'

const app = express();

const PORT = 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("User connected:");
    console.log("Id:", socket.id);
});


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}))

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send("Hello World");
});
