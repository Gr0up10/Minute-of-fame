var kurentoUtils = require('kurento-utils');

export default class Stream {
    constructor(send) {
        console.log(send);
        this.sendSocketMessage = send;
        this.presenterPeer = null;
        this.viewerPeer = null;


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
        if(isStreamer)
            this.presenterPeer.addIceCandidate(candidate, function(error) {
                if (error)
                    return console.error('Error adding candidate: ' + error);
            });
        else
            this.viewerPeer.addIceCandidate(candidate, function(error) {
                if (error)
                    return console.error('Error adding candidate: ' + error);
            });
    }

    sdp_answer(answer, isStreamer) {
        console.log("Received sdp answer "+isStreamer+answer)
        if(isStreamer)
            this.presenterPeer.processAnswer(answer, function(error) {
                if (error)
                    return console.error(error);
            });
        else
            this.viewerPeer.processAnswer(answer, function(error) {
                if (error)
                    return console.error(error);
            });
    }

    presenter() {
            var constraints = {
                    audio: true,
                    video: {
                        mandatory : {
                            chromeMediaSource: 'screen',
                            maxWidth: 1920,
                            maxHeight: 1080,
                            maxFrameRate: 30,
                            minFrameRate: 15,
                            minAspectRatio: 1.6
                        },
                        optional: []
                    }
                }

            var options = {
                localVideo: document.getElementById('local-video'),
                onicecandidate : this.onIceCandidatePresenter.bind(this),
                //mediaConstraints : constraints,
                //sendSource: 'screen',
            }
            this.presenterPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
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
                onicecandidate : this.onIceCandidateViewer.bind(this)
            }
            this.viewerPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
                    (error) => {
                        if (error) {
                            return console.error(error);
                        }
                        this.viewerPeer.generateOffer(this.onOfferViewer.bind(this));
                    });


    }

    onOfferViewer(error, offerSdp) {
        if (error)
            return console.error('Error generating the offer');
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

        this.presenter()
        this.onstream({'stream_type': 'screen', 'id': '123'})
        //$('#placeholder').css('display', 'none');

        document.getElementById("stream_title").innerHTML = $("#title_input").val();
        document.getElementById("stream_description").innerHTML = $("#description_input").val();
    }

    webcamStream() {
        document.getElementById("stream_title").innerHTML = $("#title_input").val();
        document.getElementById("stream_description").innerHTML = $("#description_input").val();

        this.presenter()
        this.onstream({'stream_type': 'screen', 'id': '123'})
        //$('#placeholder').css('display', 'none');
    }


    watchStream(input_room_id) {
        console.log('start wactch stream ', input_room_id)
        //$('#placeholder').css('display', 'none');
        viewer()
    }
}