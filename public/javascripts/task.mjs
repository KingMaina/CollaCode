import CodeMirror from 'codemirror';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'socket.io-client/dist/socket.io.js';
import 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
import 'peerjs/dist/peerjs.min.js';
import 'regenerator-runtime/runtime.js';

const socket = io(); // Initialize socket connection
let roomId = document.getElementById("roomId").value; //Get room ID

// Setup Yjs for collaboration
const yDoc = new Y.Doc();
const provider = new WebsocketProvider(
    'wss://demos.yjs.dev',
    'joinRoom',
    yDoc
);
const yText = yDoc.getText('codemirror');
const yUndoManager = new Y.UndoManager(yText);

// Setup the editor and set properties
const codeScreen = document.getElementById('code-screen');
let editor = CodeMirror.fromTextArea(codeScreen, {
    mode: 'javascript',
    tabSize: 4,
    lineNumbers: true,
    theme: "monokai"
});
const binding = new CodemirrorBinding(yText, editor, provider.awareness, { yUndoManager });

// Set username for chat section
let username = document.getElementById("chatbox-username").value;
if (username === "") {
    let userId = Math.floor(Math.random() * 9999).toString();
    username += `User${userId}`;
    document.getElementById("chatbox-username").textContent = username;
};


// Setup PeerJS for video call

// Get user media (cross-browser checks)
// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Create peer object
const peer = new Peer({
    host: location.hostname,
    port: 443,
    secure: false,
    debug: true
});
window.peer = peer;




// Set user ID in ID field
function showCallContent() {
    window.myId.textContent = window.peer.id;
}
// Set connection status after successful peer call 
function showConnectedContent(mediaConnection) {
    document.getElementById("second-id").textContent = `${mediaConnection.peer}`;
    mediaConnection.on("close", ()=> {
        document.getElementById("step3").style.display += "none";
        document.getElementById("step2").style.display += "block";
    });
    document.getElementById("step2").style.display += "none";
    document.getElementById("step3").style.display += "block";
}

// Get remote Peer ID
let peerCode;
function getStreamCode() {
    peerCode = document.getElementById("call-to-id").value;
    peerCode || alert("Please enter a peer ID to call");
};

// Connect to remote peer
let conn;
function connectPeers() {
    conn = peer.connect(peerCode);
}

// Open peer connection and set peer ID
peer.on('open', (id) => {
    document.getElementById("myId").textContent = `${id}`;
});

// Set the remote peer ID and open the connection
peer.on('connection', dataConnection => {
    conn = dataConnection;
});

// Handle incoming calls
peer.on('call', mediaConnection => {
    // If accepted send video stream and set remote video on video element
    mediaConnection.answer(window.localStream);
    if(window.existingCall){
        window.existingCall.close();
    }
    mediaConnection.on('stream', stream => {
        const remoteVideo = document.getElementById("second-video");
        remoteVideo.srcObject = stream;
        window.peerStream = stream;
        // on ending call, set status back to peer ID
        conn.on('close', () => {
            showCallContent();
        })
    });
// Update UI
    showConnectedContent(mediaConnection);
});

// Attempt to reconnect if peer disconnects
peer.on('disconnected', () => {
    alert("Disconnected!");
});

//Called when a peer call ends
peer.on('close', () => {
    alert("Video call ended");
});

// Handle all errors about the peer connection
peer.on('error', (err) => {
    alert(`Error: ${err}`);
    console.log(err);
});


// Autosave to database when user writes on the editor
editor.on('change', () => {
    let code = editor.getValue();
    setTimeout(saveCode(code), 5000); 
    // let converted_code = Y.encodeStateAsUpdate(yDoc);
});

// Send editor code to server to be saved
function saveCode(code) {
    socket.emit('updateEditor', { content: code, room: roomId });
};


/**
 *   CHAT MESSAGE SECTION
 */

// Create chat message element
let userMessage = (name, text) => {
    const listItem = document.createElement('li');
    listItem.className += 'media';

    const innerDiv = document.createElement('div');
    innerDiv.className = 'media-body';

    const innerDiv2 = document.createElement('div');
    innerDiv2.className += 'media';

    const message = document.createElement('div');
    message.className = 'media-body';

    const username = document.createElement('b');
    username.textContent = `${name}: `;

    const horizontalLine = document.createElement('hr');
    
    const messageText = `${text}`;

    message.appendChild(username);
    message.textContent += `${messageText}`;
    message.appendChild(horizontalLine);
    innerDiv2.appendChild(message);
    innerDiv.appendChild(innerDiv2);
    listItem.appendChild(innerDiv);

    return listItem;
    // return (
    //     `<li class="media">
    //         <div class="media-body">
    //             <div class="media">
    //                 <div class="media-body">
    //                     <b>${name}: </b>${text}
    //                     <hr />
    //                 </div>
    //             </div>
    //         </div>
    //     </li>`
    // );
};

// Send message to socket room to be propagated to other users
function sendMessage() {
    let userMessage = document.getElementById("userMessage").value;
    socket.emit('chatMessage',
        {
            user: username,
            message: userMessage
        });
    userMessage = "";
};

/**
 * Socket Events and Handlers
 */

// send room ID to server to create room
socket.emit('joinRoom', {
    room: roomId
});

// Update chat message panel with sent and received messages
socket.on('chatMessage', data => {
    const listItem = userMessage(data.user, data.message);
    document.getElementById("chatbox-listMessages").appendChild(listItem);
});


/**
 * EVENT LISTENERS
 */

// Send message event
document.getElementById("sendMessage").addEventListener("click", () => {
    sendMessage();
});

// Save code event
document.getElementById("save-code").addEventListener("click", () => {
    saveCode();
});

// Initiate call event
document.getElementById("make-call").addEventListener("click", () => {
    // Get permission to use camera and microphone and display in video element
    navigator.mediaDevices.getUserMedia(
        {
            audio: true,
            video: true
        }).then(stream => {
            const myVideo = document.getElementById("my-video");
            window.localStream = stream;
            myVideo.srcObject = stream;
            myVideo.onloadedmetadata = e => {
                myVideo.play();
            }
            getStreamCode(); //get remote peer ID
            connectPeers(); //connect to remote peer
            const call = peer.call(peerCode, window.localStream); //initiate call and send local video
            window.existingCall = call;
            call.on('stream', stream => {
                const remoteVideo = document.getElementById("second-video");
                window.peerStream = stream;
                remoteVideo.srcObject = stream;
                remoteVideo.onloadedmetadata = e => {
                    remoteVideo.play();
                }
                showConnectedContent();
            });
        }).catch(err => {
            console.log(`Error establishing video call! \n${err.name}: ${err.message}`);
        });
});

// Terminate call event
document.getElementById("end-call").addEventListener("click", () => {
    window.existingCall.close();
    conn.close();
    peer.destroy();
    showCallContent();
});

