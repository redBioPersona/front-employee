if (Meteor.isServer) {
  var WebSocketServer = require('websocket').server;
  var http = require('http');
  var wsServer;
  Meteor.startup(() => {
    var server = http.createServer(function(request, response) {
      response.writeHead(404);
      response.end();
    });
    server.listen(6969, function() {
      log.info("Server is listening on port 6969")
      console.log('Server is listening on port 6969');
    });
    wsServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
    });
    wsServer.on('request', function(request) {
      var connection = request.accept();
      SendToVerificationWindow=function(msj){
        connection.sendUTF(msj);
      }
      connection.on('message', function(message) {
        if (message.type === 'utf8') {
          console.log('Received Message from Client :' + message.utf8Data);
        }
      });
      connection.on('close', function(reasonCode, description) {});
    });
  });
}
