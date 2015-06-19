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
players[1] = {id:2, x:49, y:0,  connected:false,color:'red',clientId:-1};
players[2] = {id:3, x:0,  y:29, connected:false,color:'yellow',clientId:-1};
players[3] = {id:4, x:49, y:29, connected:false,color:'green',clientId:-1};  
var allClients = [];

wss.broadcast = function(data) {
  wss.clients.forEach(function each(client) {
	try {
		client.send(data);
	} catch (e) {
		console.log(e.message);
	}
  });
};


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    var msg = JSON.parse(message);
	var id = msg.data.id;
	var player = null;
	for (i = 0; i < players.length; i++) {
	  player = players[i];
	  if (player.clientId == id)
		  break;
	}
	
	switch (msg.type) {
		case "keypressed":
			var keypressed = parseInt(msg.data.key);
			if (keypressed == 37) { // LEFT
				console.log('player '+player.clientId+': LEFT');
				if (player.x != 0)
					player.x--;
			} else if (keypressed == 38) { // UP
				console.log('player '+player.clientId+': UP');
				if (player.y != 0)
					player.y--;
			} else if (keypressed == 39) { // RIGHT
				console.log('player '+player.clientId+': RIGHT');
				if (player.x != 49)
					player.x++;
			} else if (keypressed == 40) { // DOWN
				console.log('player '+player.clientId+': DOWN');
				if (player.y != 29)
					player.y++;
			}
			player.connected = true;
			var newmsg = {type:1,data:player};
			var data = JSON.stringify(newmsg);
			console.log(data);
			wss.broadcast(data);
			break;
	}	
  });

  allClients.push(ws);
  var index = allClients.indexOf(ws);
  console.log('a user connected');
  var newPlayer = null;
  for (i = 0; i < players.length; i++) {
	  if (!players[i].connected) {
		  players[i].clientId = index;
		  newPlayer = players[i];
		  break;
	  }
  }
  if (newPlayer == null) {
	var newmsg = {type:2,data:'All available players are connected'};
	console.log(newmsg);
	ws.send(JSON.stringify(newmsg));
  } else {
	console.log('new client id: %d', index);
	
	var newmsg = {type:0,data:newPlayer};
	console.log(newmsg);
	wss.broadcast(JSON.stringify(newmsg));
  }
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