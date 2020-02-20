let connection = new RTCMultiConnection();
// v3.4.7 or newer
connection.socketURL = 'http://localhost:9001/';
connection.videosContainer = document.getElementById('stream-box');

connection.session = {
    screen: true,
    oneway: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};

let room_id = document.getElementById('room_id');
//room_id.value = connection.token()

document.getElementById('btn-connect').onclick = function () {
    this.disabled = true;
    connection.openOrJoin(room_id.value || 'predefined-roomid');
};