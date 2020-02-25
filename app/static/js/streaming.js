let connection = new RTCMultiConnection();
// v3.4.7 or newer
connection.socketURL = 'http://localhost:9001/';
connection.videosContainer = document.getElementById('stream-box');

//let room_id = document.getElementById('room_id');
//room_id.value = connection.token()

function screen_stream() {
    connection.session = {
        screen: true,
        oneway: true
    };

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };
    connection.openOrJoin(room_id.value || 'predefined-roomid');

}

function webcam_stream() {

    navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia({video: true, audio: true}, function () {
        // webcam is available
        alert("Microphone or webcam are connected with your system");
        connection.session = {
            audio: true,
            video: true
        };

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };
        connection.openOrJoin(room_id.value || 'predefined-roomid');

    }, function () {
        // webcam is not available
        alert("Microphone or webcam are not connected with your system");

    });
}

function removeStream() {
    connection.getAllParticipants().forEach(function (pid) {
        connection.disconnectWith(pid);
    });

    // stop all local cameras
    connection.attachStreams.forEach(function (localStream) {
        localStream.stop();
    });

    // close socket.io connection
    connection.closeSocket();
}