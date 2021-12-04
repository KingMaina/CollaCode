"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = require("socket.io");

var Y = _interopRequireWildcard(require("yjs"));

var _yWebsocket = require("y-websocket");

var _this = void 0;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var roomList = {};

var _default = function _default(server) {
  var io = new _socket.Server(server);
  io.on("connection", function (socket) {
    socket.on('joinRoom', function (data) {
      if (!roomList[data.room]) {
        // let socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, (socket, cb) => {
        //     cb(true);
        // });
        var self = _this; // roomList[data.room] = socketIOServer;
        // Task.findByIdAndUpdate(data.room, {content: self.document}, err => {
        //     err ? cb(false) : cb(true); 
        // });
      } // roomList[data.room].addClient(socket);
      // roomList[data.room].setName(socket, data.username);
      // console.log(`There is this data: ${data.message}`);


      socket.room = data.room;
      socket.join(data.room);
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