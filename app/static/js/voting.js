$('#like-stream').click(send_like);
$('#dislike-stream').click(send_dislike);

const poll_result_paragraph = document.querySelector('p');

var PollConsumer = new WebSocket('ws://'+ window.location.host +'/ws');

PollConsumer.addEventListener('message', poll_update)
PollConsumer.addEventListener('open', open)

function send_like() {
    PollConsumer.send(JSON.stringify({'message': "like"}));
};

function send_dislike() {
    PollConsumer.send(JSON.stringify({'message': "dislike"}));
}

function poll_update() {
    console.log(event.data)
    poll_result_paragraph.textContent= event.data;
}

function open() {
    PollConsumer.send(JSON.stringify({'message': "open"}));
}