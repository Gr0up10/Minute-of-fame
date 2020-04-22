export default class Stream {
    constructor() {
        this.connection = new RTCMultiConnection();
        this.connection.socketURL = 'http://' + location.hostname + ':9001/';
        this.connection.videosContainer = document.getElementById('stream-box');

        this.connection.onstream = (event) => {
            this.streaming = true
            console.log('on stream')
            if (event.type === 'local') {
                this.onstream({'stream_type': 'screen', 'id': this.user_room_id});
            }
            var video = event.mediaElement;
            video.id = event.streamid;
            $('#videos-container').append(video) //document.body.insertBefore(video, document.body.firstChild);
        };

        this.connection.onstreamended = (event) => {
            this.streaming = false
            var video = document.getElementById(event.streamid);
            if (video && video.parentNode) {
                $('#videos-container').empty()
            }
        };

        this.user_room_id = document.getElementById('user_room_id').value.toString();

        this.onstream = ()=>({});
        this.streaming = false;

        this.bind_buttons();
        this.streaming = false
    }

    bind_buttons() {
        $('#btn-connect-screen').click(this.screenStream.bind(this))
        $('#btn-connect-webcam').click(this.webcamStream.bind(this))
        $('#stop-stream').click(this.stopStream.bind(this))

    }

    screenStream() {

        this.streaming = true;

        this.connection.session = {
            screen: true,
            oneway: true
        };

        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };
        this.connection.openOrJoin(this.user_room_id);
    }

    webcamStream() {
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
            this.connection.openOrJoin(this.user_room_id);

        }, function () {
            // webcam is not available
            alert("Microphone or webcam are not connected with your system");

        });
    }

    stopStream() {
        this.streaming = false
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
        if(this.streaming) this.stopStream()
        console.log('start wactch stream ', input_room_id)
        $('#placeholder').css('display', 'none');
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
                alert('Room does not exists: '+input_room_id);
            }
        });
    }
}