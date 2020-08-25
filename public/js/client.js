
var clientId = null;

var host = URL.host ? URL.host : 'localhost';
var port = 3001;

var ws = new WebSocket('ws://' + host + ':' + port);

ws.onopen = function (event) {
    console.log('Connection opened');
}

$('#canvasWrapper').keydown(function(e) {
    var msg = {
        type: 'keypressed',
        data: {id:clientId, key:e.which}
    };
    ws.send(JSON.stringify(msg));
});

ws.onmessage = function (event)
{
    var msg = decodeMsg(event);
    var type = getType(msg);
    
    switch (type) {
    case 0: // player connected
      playerConnected(msg);
    case 1: // new position
      newPosition(msg);
      break;
    case 2: // max players reached
      maxPlayersReached(msg);
      break;
    case 3: // player disconnected
      playerDisconnected(msg);
      break;
    }
};

function newPosition(msg) {
  var player = msg['data'];
  if (clientId == null) {
      clientId = player.clientId;
  }

  var context = getCanvasContext();
  context.fillStyle = 'white';
  context.fillRect(player['previous_x'], player['previous_y'], 10, 10);
  context.fillStyle = player['color'];
  context.fillRect(player['x'], player['y'], 10, 10); 
}

function playerDisconnected(msg) {
  var player = msg['data'];

  var context = getCanvasContext();
  context.fillStyle = 'white';
  context.fillRect(player['x'], player['y'], 10, 10);
}

function decodeMsg(event) {
  return JSON.parse(event.data);
}

function getType(msg) {
  return parseInt(msg['type']);
}

function playerConnected(msg) {
  console.log('A new player is connected.');
}

function maxPlayersReached(msg) {
  alert('Max number of players reached ' + msg['data']);
}

function getCanvasContext() {
  return document.getElementById("game").getContext('2d');
}