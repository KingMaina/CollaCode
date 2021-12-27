"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = require("socket.io");

var Y = _interopRequireWildcard(require("yjs"));

var _task = require("./routes/task");

var _www = _interopRequireDefault(require("./bin/www.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var roomList = {};

var _default = function _default(server) {
  var doc = new Y.Doc();
  var defaultCode = "console.log('Greetings from CollaCode')";
  var io = new _socket.Server(server);
  io.on("connection", function (socket) {
    socket.on('joinRoom', function (data) {
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
    }); // socket.on('peerSocket', data => {
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

    socket.on('updateEditor', function (data) {
      _task.Task.findByIdAndUpdate(data.room, {
        content: data.content
      }, {
        returnDocument: 'after',
        upsert: true
      }, function (err) {
        err ? console.log(err) : true;
      });
    });
    socket.on("chatMessage", function (data) {
      io.to(socket.room).emit("chatMessage", data);
    });
    socket.on('disconnect', function () {
      socket.leave(socket.room);
    });
  });
};

exports["default"] = _default;