import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // Import Server class directly
import cors from "cors"

const app = express();
const port = process.env.PORT || 3000
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors()); // Use CORS middleware
// Event handling for text updates
io.on('connection', (socket) => {
    socket.on('content-change', (data) => {
        socket.broadcast.emit('content-change', data); // Broadcast to others
    });
});


server.listen(port, ()=>{
  console.log("Server is running on Port:",port)
})