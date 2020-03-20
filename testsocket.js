var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
