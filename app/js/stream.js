export default class Stream {
    constructor() {
        this.connection = new RTCMultiConnection();
        this.connection.socketURL = 'http://' + location.hostname + ':9001/';
        this.connection.videosContainer = document.getElementById('stream-box');

        this.user_room_id = document.getElementById('user_room_id');

        this.onstream = ()=>({});
        this.streaming = false;

        this.bind_buttons();
    }

    bind_buttons() {
        $('#btn-connect-screen').click(this.screenStream.bind(this))
        $('#btn-connect-webcam').click(this.webcamStream.bind(this))
        $('#stop-stream').click(this.stopStream.bind(this))

    }

    screenStream() {
        this.onstream('screen');
        this.streaming = true;

        this.connection.session = {
            screen: true,
            oneway: true
        };

        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };
        this.connection.openOrJoin(this.user_room_id.value.toString());
    }

    webcamStream() {
        this.onstream('cam');
        this.streaming = true;
        navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia({video: true, audio: true}, () => {
            // webcam is available
            this.connection.session = {
                audio: true,
                video: true
            };

            this.connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };
            this.connection.openOrJoin(this.user_room_id.value.toString());

        }, function () {
            // webcam is not available
            alert("Microphone or webcam are not connected with your system");

        });
    }

    stopStream() {
        this.connection.getAllParticipants().forEach((pid) => {
            this.connection.disconnectWith(pid);
        });

        // stop all local cameras
        this.connection.attachStreams.forEach(function (localStream) {
            localStream.stop();
        });

        // close socket.io connection
        this.connection.closeSocket();
    }

    watchStream(input_room_id) {
        this.connection.checkPresence(input_room_id, (isRoomExist, room_id) => {
            if (isRoomExist === true) {
                this.connection.session = {
                    data: true
                };
                this.connection.sdpConstraints.mandatory = {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true
                };
                this.connection.join(room_id);
            } else {
                alert('Такой комнаты не существует!');
            }
        });
    }
}