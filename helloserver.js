var server = require('http').createServer( function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("hello, world\n");
  console.log("Hello");
});
server.listen(8080);
