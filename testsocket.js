var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/testsocket.html');
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
