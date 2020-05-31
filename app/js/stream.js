var WebRtcPeer = require('./WebRtcPeer.js');

export default class Stream {
    constructor(send) {
        console.log(send);
        this.sendSocketMessage = send;
        this.presenterPeer = null;
        this.viewerPeer = null;
        this.fakePeer = null;
        this.fakeDone = false;
        this.ice_candidates = {};
        this.presenter_ready = false;
        this.viewer_ready = false;
        this.stream_type = 'screen'
        this.ice_servers = [
               {
               'urls': [
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                    'stun:stun.l.google.com:19302?transport=udp',
                ]
            },
            {
                urls: ["turn:51.15.91.233:3478"],
                username: "username",
                credential: "password"
            },
            //{
             //   urls: ["stun:51.15.64.125:3478", "stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
                //username: "username",//"stun:51.15.64.125:3478",
                //credential: "password"
            //},

        ];
        console.log(JSON.stringify(this.ice_servers));


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
            if(this.fakeDone) {
                console.log("Adding for presenter, save: "+this.presenter_ready)
                if(!this.presenter_ready)
                    this.ice_candidates['pub'] = [candidate].concat(this.ice_candidates['pub'] || []);
                else
                    this.presenterPeer.addIceCandidate(candidate, function(error) {
                        if (error)
                            return console.error('Error adding candidate: ' + error);
                        console.log("Ice added successfully for presenter")
                    });
            } else {
                this.fakePeer.addIceCandidate(candidate, function(error) {
                    if (error)
                        return console.error('Error adding candidate: ' + error);
                    console.log("Ice added successfully for FAKE presenter")
                });
            }
        } else {
            console.log("Adding for viewer, save: "+this.presenter_ready)
            if(!this.viewer_ready)
                this.ice_candidates['view'] = [candidate].concat(this.ice_candidates['view'] || []);
            else
                this.viewerPeer.addIceCandidate(candidate, function(error) {
                    if (error)
                        return console.error('Error adding candidate: ' + error);
                    console.log("Ice added successfully for viewer")
                });
        }

    }

    sdp_answer(answer, isStreamer) {
        console.log("Received sdp answer "+isStreamer+answer)
        var self = this
        if(isStreamer){
            if(this.fakeDone) {
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
                this.fakePeer.processAnswer(answer, function(error) {
                    if (error)
                        return console.error(error);

                    self.fakeDone = true;
                    console.log('fake done')
                    setTimeout(() => self.viewer(), 1500)
                });
            }
        } else {
            this.viewerPeer.processAnswer(answer, function(error) {
                if (error)
                    return console.error(error);
                self.viewer_ready = true
                if(self.ice_candidates['view'])
                    self.ice_candidates['view'].forEach((candidate) =>
                        self.viewerPeer.addIceCandidate(candidate, function(error) {
                            if (error)
                                return console.error('Error adding candidate: ' + error);
                            console.log("viewer connected")
                        }
                    ));
            });
        }
    }

    presenter(input) {
            this.screen_type = input
            //if(input == 'screen') {
            //    this.camMedia = navigator.mediaDevices.getUserMedia;
            //    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getDisplayMedia;
            //} else if(this.camMedia !== undefined) navigator.mediaDevices.getUserMedia = this.camMedia;

            var options = {
                localVideo: document.getElementById('local-video'),
                onicecandidate : this.onIceCandidatePresenter.bind(this),
                iceServers: this.ice_servers,
                iceTransportPolicy:"all",
                iceCandidatePoolSize:"0",
                //mediaConstraints : constraints,
                sendSource: input,
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

        this.sendSocketMessage('connect', {"offer": offerSdp, "presenter": true, "fake": false});

        this.onstream({'stream_type': this.stream_type, 'id': this.user_room_id});
    }

    viewer() {
        console.log("Viewer started")
        //let w = 640;
        //let h = 480;
        //let canvas = Object.assign(document.createElement("canvas"), { w, h });
        //canvas.getContext('2d').fillRect(0, 0, w, h);
        //let blackStream = canvas.captureStream();
            var options = {
                remoteVideo : document.getElementById('video'),
                onicecandidate : this.onIceCandidateViewer.bind(this),
                iceServers: this.ice_servers,
                iceTransportPolicy:"rely",
                iceCandidatePoolSize:"0",
          //      videoStream: blackStream
            }
            //console.log("Presenter config: "+JSON.stringify(options));
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

        this.sendSocketMessage('connect', {"offer": offerSdp, "presenter": false, "fake": false});
    }

    startFakeStream() {
        console.log("Start fake stream")
        let w = 640;
        let h = 480;
        let canvas = Object.assign(document.createElement("canvas"), { w, h });
        canvas.getContext('2d').fillRect(0, 0, w, h);
        let blackStream = canvas.captureStream();

        var options = {
            onicecandidate : this.onIceCandidateFake.bind(this),
            iceServers: this.ice_servers,
            iceTransportPolicy:"all",
            iceCandidatePoolSize:"0",
            videoStream: blackStream
        }
        //console.log("Presenter config: "+JSON.stringify(options));
        this.fakePeer = new WebRtcPeer.WebRtcPeerSendonly(options,
                (error) => {
                    if (error) {
                        return console.error(error);
                    }
                    this.fakePeer.generateOffer(this.onOfferFake.bind(this));
                });
    }


    onOfferFake(error, offerSdp) {
        if (error)
            return console.error('Error generating the offer'+error);
        console.info('Invoking fake SDP offer callback function ' + location.host);

        this.sendSocketMessage('connect', {"offer": offerSdp, "presenter": true, "fake": true});
    }

    onIceCandidatePresenter(candidate) {
        var cand = candidate.toJSON()
        cand.presenter = true
        console.log(cand)
        this.sendSocketMessage('ice_candidate', cand);
    }

    onIceCandidateFake(candidate) {
        var cand = candidate.toJSON()
        cand.presenter = true
        console.log("fake cand")
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
        this.fakeDone = true;

        this.presenter('screen')
        //this.onstream({'stream_type': 'screen', 'id': this.user_room_id})
        //$('#placeholder').css('display', 'none');

        //document.getElementById("stream_title").innerHTML = $("#title_input").val();
        //document.getElementById("stream_description").innerHTML = $("#description_input").val();
        //document.getElementById("streamer_name").innerHTML = document.getElementById("username").innerText

    }

    webcamStream() {
        //document.getElementById("stream_title").innerHTML = $("#title_input").val();
        //document.getElementById("stream_description").innerHTML = $("#description_input").val();
        //document.getElementById("streamer_name").innerHTML = document.getElementById("username").innerText

        this.fakeDone = true;
        this.presenter('cam')

        //$('#placeholder').css('display', 'none');
    }


    watchStream() {
        //console.log('start wactch stream ', input_room_id)
        //$('#placeholder').css('display', 'none');
        //viewer()
        //this.startFakeStream()
        this.viewer()
    }
}