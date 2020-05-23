var WebRtcPeer = require('./WebRtcPeer.js');

export default class Stream {
    constructor(send) {
        console.log(send);
        this.sendSocketMessage = send;
        this.presenterPeer = null;
        this.viewerPeer = null;
        this.ice_candidates = {};
        this.presenter_ready = false;
        this.viewer_ready = false;
        this.ice_servers = [
            {
                urls: "stun:51.15.64.125:3478"
            },
            {
                urls: "turn:51.15.64.125:3478",
                username: "username",
                credential: "password"
            },
        ];


              //  this.onstream({'stream_type': 'screen', 'id': this.user_room_id});

        // $('#videos-container').empty()
        this.user_room_id = document.getElementById('user_room_id').value.toString();

        this.onstream = ()=>({});
        this.streaming = false;

        this.bind_buttons();
        this.streaming = false
    }

    bind_buttons() {
        $('#btn-connect-screen').click(this.screenStream.bind(this))
        $('#btn-connect-webcam').click(this.webcamStream.bind(this))
        $('.debug').click(() => {
            console.log('Getting stats')
            console.log(this.viewerPeer)
            window.viewerPeer = this.viewerPeer
            this.viewerPeer.getStats(function(stats) {console.log(stats)})
        });
        //$('#stop-stream').click(this.stopStream.bind(this))

    }

    ice_candidate(candidate, isStreamer) {
        console.log("Received ice candidate "+isStreamer+candidate)
        if(isStreamer){
            if(!this.presenter_ready)
                this.ice_candidates['pub'] = [candidate].concat(this.ice_candidates['pub'] || []);
            else
                this.presenterPeer.addIceCandidate(candidate, function(error) {
                    if (error)
                        return console.error('Error adding candidate: ' + error);
                });
        } else {
            if(!this.presenter_ready)
                this.ice_candidates['view'] = [candidate].concat(this.ice_candidates['view'] || []);
            else
                this.viewerPeer.addIceCandidate(candidate, function(error) {
                    if (error)
                        return console.error('Error adding candidate: ' + error);
                });
        }

    }

    sdp_answer(answer, isStreamer) {
        console.log("Received sdp answer "+isStreamer+answer)
        if(isStreamer){
            var self = this
            this.presenterPeer.processAnswer(answer, function(error) {
                if (error)
                    return console.error(error);
                self.presenter_ready = true
                if(self.ice_candidates['pub'])
                    self.ice_candidates['pub'].forEach((candidate) =>
                        self.presenterPeer.addIceCandidate(candidate, function(error) {
                            if (error)
                                return console.error('Error adding candidate: ' + error);
                        }
                    ));
            });
            
        } else {
            var self = this
            this.viewerPeer.processAnswer(answer, function(error) {
                if (error)
                    return console.error(error);
                self.viewer_ready = true
                if(self.ice_candidates['view'])
                    self.ice_candidates['view'].forEach((candidate) =>
                        self.viewerPeer.addIceCandidate(candidate, function(error) {
                            if (error)
                                return console.error('Error adding candidate: ' + error);
                        }
                    ));
            });
            
        }
    }

    presenter(input) {
            if(input == 'screen') {
                this.camMedia = navigator.mediaDevices.getUserMedia;
                navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getDisplayMedia;
            } else if(this.camMedia !== undefined) navigator.mediaDevices.getUserMedia = this.camMedia;

            var options = {
                localVideo: document.getElementById('local-video'),
                onicecandidate : this.onIceCandidatePresenter.bind(this),
                iceServers: this.ice_servers
                //mediaConstraints : constraints,
                //sendSource: 'screen',
            }
            this.presenterPeer = new WebRtcPeer.WebRtcPeerSendonly(options,
                    (error) => {
                        if (error) {
                            return console.error(error);
                        }
                        this.presenterPeer.generateOffer(this.onOfferPresenter.bind(this));
                    });

    }

    onOfferPresenter(error, offerSdp) {
        if (error)
            return console.error('Error generating the offer'+error);
        console.info('Invoking SDP offer callback function ' + location.host);

        this.sendSocketMessage('connect', {"offer": offerSdp, "presenter": true});
    }

    viewer() {
            var options = {
                remoteVideo : document.getElementById('video'),
                onicecandidate : this.onIceCandidateViewer.bind(this),
                iceServers: this.ice_servers
            }
            this.viewerPeer = new WebRtcPeer.WebRtcPeerRecvonly(options,
                    (error) => {
                        if (error) {
                            return console.error(error);
                        }
                        this.viewerPeer.generateOffer(this.onOfferViewer.bind(this));
                    });


    }

    onOfferViewer(error, offerSdp) {
        if (error)
            return console.error('Error generating the offer'+error);
        console.info('Invoking SDP offer callback function ' + location.host);

        this.sendSocketMessage('connect', {"offer": offerSdp, "presenter": false});
    }

    onIceCandidatePresenter(candidate) {
        var cand = candidate.toJSON()
        cand.presenter = true
        console.log(cand)
        this.sendSocketMessage('ice_candidate', cand);
    }

    onIceCandidateViewer(candidate) {
        var cand = candidate.toJSON()
        cand.presenter = false
        console.log(cand)
        this.sendSocketMessage('ice_candidate', cand);
    }

    dispose() {
        if (presenterPeer) {
            presenterPeer.dispose();
            presenterPeer = null;
        }
        if (viewerPeer) {
            viewerPeer.dispose();
            viewerPeer = null;
        }
    }


    screenStream() {
        this.streaming = true;

        this.presenter('screen')
        this.onstream({'stream_type': 'screen', 'id': '123'})
        //$('#placeholder').css('display', 'none');

        document.getElementById("stream_title").innerHTML = $("#title_input").val();
        document.getElementById("stream_description").innerHTML = $("#description_input").val();
        document.getElementById("streamer_name").innerHTML = document.getElementById("username").innerText

    }

    webcamStream() {
        document.getElementById("stream_title").innerHTML = $("#title_input").val();
        document.getElementById("stream_description").innerHTML = $("#description_input").val();
        document.getElementById("streamer_name").innerHTML = document.getElementById("username").innerText


        this.presenter('cam')
        this.onstream({'stream_type': 'screen', 'id': '123'})
        //$('#placeholder').css('display', 'none');
    }


    watchStream(input_room_id) {
        console.log('start wactch stream ', input_room_id)
        //$('#placeholder').css('display', 'none');
        viewer()
    }
}