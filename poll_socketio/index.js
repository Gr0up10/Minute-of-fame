var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

 var likes=0;
 var dislikes=0;
 var poll_result=0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg);
  });
   socket.on('like', function(msg){
    likes+=1;
    console.log("like+ " + msg);
    poll_result=Math.round(likes/(likes+dislikes)*100);
    io.emit('updateInfo',poll_result);
    console.log("updateInfo= " + poll_result);
  });
   socket.on('dislike', function(msg){
    dislikes+=1;
    console.log("dislike+ " + msg);
    poll_result=Math.round(likes/(likes+dislikes)*100);
    io.emit('updateInfo', poll_result);
    console.log("updateInfo= " +poll_result);
  });

});


http.listen(port, function(){
  console.log('listening on *:' + port);

});
