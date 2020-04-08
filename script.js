'use strict';
let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        let video = document.getElementById('mystream');
        console.log(video, "video");
        video.srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });
// navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
//     if (navigator.mediaDevices.getUserMedia) {
//         navigator.mediaDevices.getUserMedia({  audio: true, video: true })
//         .then(function (stream) {
//             $('#myStream').srcObject = stream;
//             localStream = stream;
//          })
//         .catch(function (e) { 
//             console.error('mediaDevice.getUserMedia() error:', error);
//             return;   
//         });
//     }
//     else {
//     navigator.getWebcam({ audio: true, video: true }, 
//          function (stream) {
//             $('#myStream').srcObject = stream;
//             localStream = stream;
//          }, 
//          function () { 
//             console.error('mediaDevice.getUserMedia() error:', error);
//             return; 
//          });
//     }

peer = new Peer({
    key: 'bfd918d3-5c58-42e0-a4e9-6054a5114d9e',
    debug: 3
});

peer.on('open', function(){
    $('#my-id').text(peer.id);
});
peer.on('error', function(err){
    alert(err.message);
});
peer.on('close', function(){
});
peer.on('disconnected', function(){
});

$('#make-call').submit(function(e){
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){
    existingCall.close();
});

peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){
        addVideo(call, stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}
function addVideo(call, stream){
    $('#their-video').get(0).srcObject = stream;
    console.log(stream);
}
function removeVideo(peerId){
    $('#their-video').get(0).srcObject = undefined;
}
function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}