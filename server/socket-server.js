import { Server } from 'socket.io';
import * as Y from 'yjs';
import { Task } from './routes/task';
let roomList = {};
import peer from './bin/www.js';

export default server => {
    const doc = new Y.Doc();
    let defaultCode = "console.log('Greetings from CollaCode')";
    const io = new Server(server);
    io.on("connection", (socket) => {
        socket.on('joinRoom', data => {
            // if(!data.content){
            //     data.content = defaultCode;
            // }
            // if (!roomList[data.room]) {

            // }else{

            // if(!roomList[data.room]){
            //     data.content = defaultCode;
            //     io.to(socket.room).emit('joinRoom', data.content);
            //     // let task = {
            //     //     name: 
            //     // }
            //     //  Task.findByIdAndUpdate(data.room, {content: data.content}, function (err){
            //     // err ? console.log(err) : `${console.log("Worked!!")} ${data.content}`
            //     // });
            //      // let socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, (socket, cb) => {
            //     //     cb(true);
            //     // });
            //     //  Task.findByIdAndUpdate(data.room, {content: data.code}, err => {
            //     //     err ? cb(false) : cb(true);
            //     // });
            //     // roomList[data.room] = socketIOServer;
            //     // Task.findByIdAndUpdate(data.room, {content: self.document}, err => {
            //     //     err ? cb(false) : cb(true); 
            //     // });
            // }
            // roomList[data.room] = data.room;
            socket.room = data.room;
            socket.join(data.room);



        });

        // socket.on('peerSocket', data => {
        //     peer ? io.to(socket.room).emit("peerSocket", peer.id) : console.error("No peer was found!");
        // });
        // socket.on("peerSocket", data => {
        //     const peer = new Peer(`${data.username}${data.room}`, {
        //         host: 'localhost',
        //         port: process.env.PORT || 3000,
        //         path: '/',
        //         secure: true,
        //         debug: true
        //     });
        //     peer.on('open', id => {
        //         io.to(socket.room).emit("peerSocket", id);
        //     });
        //     peer.on('call', call => {
        //         call.answer(data.localStream);
        //         step3(call);
        //         io.to(socket.room).emit("peerSocket", call);
        //     });
        //     peer.on('error', err => {
        //             io.to(socket.room).emit("peerSocket", err.message);
        //             step2();
        //     });
        //     function step1(){
        //         // get audio/videoStream
        //         let isVideoStream = false;
        //         io.to(socket.room).emit("peerSocket", !isVideoStream);
        //     }
        //     function step2(){
        //         let isSwitch = false;
        //         io.to(socket.room).emit("peerSocket", !isSwitch)
        //         return true;
        //     };

        //     function step3(call){
        //         if(data.existingCall){
        //             existingCall.close();
        //         }
        //         call.on('stream', stream => {
        //             let streamObject = URL.createObjectURL(stream);
        //             io.to(socket.room).emit("peerSocket", streamObject);

        //             //update UI
        //             streamObject = call;
        //             io.to(socket.room).emit("peerSocket", call.peer);
        //             let isClosed = call.on('close', step2) ? true : false;
        //             io.to(socket.room).emit("peerSocket", isClosed);

        //         });
                
        //     }
        // });
        socket.on('updateEditor', data => {
            Task.findByIdAndUpdate(data.room, { content: data.content }, { returnDocument: 'after', upsert: true }, function (err) {
                err ? console.log(err) : true;
            });
        })
        socket.on("chatMessage", data => {
            io.to(socket.room).emit("chatMessage", data);
        });
        socket.on('disconnect', () => {
            socket.leave(socket.room);
        });

    });

} 