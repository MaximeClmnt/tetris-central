var server = require('http').createServer( function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("hello, world2\n");
  console.log("Hello");
});
server.listen(process.env.PORT || 5000);
