var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('/index.html');
});

var server = app.listen(3000, function () {

  var port = server.address().port;
  console.log('canvasgame webserver listening at %d', port);

});

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 3001 });

console.log('canvasgame app listening at %d', 3001);

// game variables
var players = [];
players[0] = {id:1, x:0,  y:0,  connected:false,color:'blue',clientId:-1};
players[1] = {id:2, x:99, y:0,  connected:false,color:'red',clientId:-1};
players[2] = {id:3, x:0,  y:59, connected:false,color:'yellow',clientId:-1};
players[3] = {id:4, x:99, y:59, connected:false,color:'green',clientId:-1};  
var allClients = [];

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
	
	var msg = JSON.parse(msg);
	var i = allClients.indexOf(ws);
	var player = null;
	for (i = 0; i < players.length; i++) {
	  player = players[i];
	  if (player.clientId == i)
		  break;
	}
	switch (msg.type) {
		case "keypressed":
			var keypressed = parseInt(msg.data);
			if (keypressed == 37) { // LEFT
				if (player.x != 0)
					player.x--;
			} else if (keypressed == 38) { // UP
				if (player.y != 0)
					player.y--;
			} else if (keypressed == 39) { // RIGHT
				if (player.x != 0)
					player.x++;
			} else if (keypressed == 40) { // DOWN
				if (player.y != 59)
					player.y++;
			}
			var newmsg = {type:"new position",data:JSON.stringfy(player)};
			wss.broadcast(newmsg);
			break;
	}
	
  });
  allClients.push(ws);
  console.log('a user connected');
  var newPlayer = null;
  for (i = 0; i < players.length; i++) {
	  if (!players[i].connected) {
		  newPlayer = players[i];
		  break;
	  }
  }
  if (newPlayer == null) {
	ws.send('max reached', 'All available players are connected');
  } else {
	var i = allClients.indexOf(socket);
	newPlayer.clientId = i;
	console.log('new client id: %d', i);
	
	var newmsg = {type:"new position",data:JSON.stringfy(newPlayer)};
	wss.broadcast(newmsg);
  }
  ws.send('open');
});

/*
socket.on('disconnect', function(){
	var i = allClients.indexOf(socket);
	for (i = 0; i < players.length; i++) {
	  var player = players[i];
	  if (player.clientId == i) {
		  player.clientId = -1;
		  player.connected = false;
		  io.emit('new position', JSON.stringfy(player));
		  break;
	  }
    }
    delete allClients[i];
    console.log('user disconnected');
  });
*/