var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 3000 });

// game variables
var players = [];
players[0] = {id:1, x:0,  y:0,  connected:false,color:'blue',clientId:-1};
players[1] = {id:2, x:99, y:0,  connected:false,color:'red',clientId:-1};
players[2] = {id:3, x:0,  y:59, connected:false,color:'yellow',clientId:-1};
players[3] = {id:4, x:99, y:59, connected:false,color:'green',clientId:-1};  

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  console.log('someone connected');
  ws.send('open');
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var allClients = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  allClients.push(socket);
  console.log('a user connected');
  var newPlayer = null;
  for (i = 0; i < players.length; i++) {
	  if (!players[i].connected) {
		  newPlayer = players[i];
		  break;
	  }
  }
  if (newPlayer == null) {
	io.send('max reached', 'All available players are connected');
  } else {
	var i = allClients.indexOf(socket);
	newPlayer.clientId = i;
	io.emit('new position', JSON.stringify(newPlayer));
  }
  
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
  
  socket.on('keypressed', function(msg){
	var i = allClients.indexOf(socket);
	var player = null;
	for (i = 0; i < players.length; i++) {
	  player = players[i];
	  if (player.clientId == i)
		  break;
	}
	var keypressed = parseInt(msg);
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
	io.emit('new position', JSON.stringfy(player));
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/