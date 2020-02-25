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
    try {
        connection.session = {
            audio: true,
            video: true
        };

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };
        connection.openOrJoin(room_id.value || 'predefined-roomid');
    } catch (e) {
        alert("Microphone or webcam not found");
    }
}