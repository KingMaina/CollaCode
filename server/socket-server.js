import { Server } from 'socket.io';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
let roomList = {};

export default server => {
    const io = new Server(server);
    io.on("connection", (socket) => {
        socket.on('joinRoom', data => {
            if(!roomList[data.room]){
                 // let socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, (socket, cb) => {
                //     cb(true);
                // });
                //  Task.findByIdAndUpdate(data.room, {content: data.code}, err => {
                //     err ? cb(false) : cb(true);
                // });
                // roomList[data.room] = socketIOServer;
                // Task.findByIdAndUpdate(data.room, {content: self.document}, err => {
                //     err ? cb(false) : cb(true); 
                // });
            }
            // roomList[data.room].addClient(socket);
            // roomList[data.room].setName(socket, data.username);
            // console.log(`There is this data: ${data.message}`);
            socket.room = data.room;
            socket.join(data.room);
        });
        socket.on("chatMessage", data => {
            io.to(socket.room).emit("chatMessage", data);
        });
        socket.on('disconnect', () => {
            socket.leave(socket.room);
        });

    });
     
} 