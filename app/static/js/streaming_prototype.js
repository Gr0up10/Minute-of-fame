connection.session = {
    audio: true,
    video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

user_room_id = document.getElementById('room_id');
//room_id.value = connection.token()

document.getElementById('btn-connect-cam').onclick = function() {
    this.disabled = true;
    connection.openOrJoin(room_id.value || 'predefined-roomid');
};