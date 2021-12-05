import CodeMirror from 'codemirror';
import * as Y from 'yjs';
import {WebsocketProvider} from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
// import yWebsocketsClient from 'y-websockets-client';
import '/node_modules/codemirror/mode/javascript/javascript.js';
import '/node_modules/socket.io/client-dist/socket.io.js';
import '/node_modules/codemirror/lib/codemirror.js';
import '/node_modules/codemirror/mode/javascript/javascript.js';

const socket = io();
// const io = yWebsocketsClient['websockets-client'].io;

const codeScreen = document.getElementById('code-screen');
const yDoc =new Y.Doc();
const provider = new WebsocketProvider(
    'wss://demos.yjs.dev',
    'joinRoom',
    yDoc
);
const yText = yDoc.getText('codemirror');
const yUndoManager = new Y.UndoManager(yText);

let editor = CodeMirror.fromTextArea(codeScreen, {
    mode: 'javascript',
    lineNumbers: true,
    theme: "monokai"
});
 
const binding = new CodemirrorBinding(yText, editor, provider.awareness, { yUndoManager });

let roomId = $("#roomId").val();
let code = editor.getValue();

// let code = $('#code-screen').val();
console.log(code);
let cmClient;

let username = $("#chatbox-username").val();

if (!username) {
    let userId = Math.floor(Math.random() * 9999).toString();
    username += `User${userId}`;
    $("#chatbox-username").text(username);
}
socket.emit('joinRoom', {
    room: roomId,
    code: code
});

let userMessage = (name, text) => {
    return (
        `<li class="media">
            <div class="media-body">
                <div class="media">
                    <div class="media-body">
                        <b>${name}: </b>${text}
                        <hr />
                    </div>
                </div>
            </div>
        </li>`
    );
};

function sendMessage() {
    let userMessage = $('#userMessage').val();
    socket.emit('chatMessage', { message: userMessage, username: username });
    $("#userMessage").val("");
};

socket.on('chatMessage', data => {
    $("#chatbox-listMessages").append(userMessage(data.username, data.message));
});

document.getElementById("sendMessage").addEventListener("click", () => {
    sendMessage();
});
