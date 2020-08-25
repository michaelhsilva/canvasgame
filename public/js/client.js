
  var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
      return query_string;
  } ();

  var clientId = null;

  var hostnameOrIP = "localhost";
  if (QueryString.host)
    hostnameOrIP = QueryString.host;

  var ws = new WebSocket('ws://'+hostnameOrIP+':3001');

  ws.onopen = function (event) {
      // Connection opened
  }

  $("#canvasWrapper").keydown(function(e) {
      var msg = {
          type: "keypressed",
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

function decodeMsg(event) {
  return JSON.parse(event.data);
}

function getType(msg) {
  return parseInt(msg['type']);
}

function playerConnected(msg) {
  console.log('A new player is connected.');
}

function newPosition(msg) {
  var player = msg['data'];
  if (clientId == null) {
      clientId = player.clientId;
  }

  var context = getCanvasContext();
  context.fillStyle = "white";
  context.fillRect(player['previous_x'], player['previous_y'], 10, 10);
  context.fillStyle = player['color'];
  context.fillRect(player['x'], player['y'], 10, 10); 
}

function playerDisconnected(msg) {
  var player = msg['data'];

  var context = getCanvasContext();
  context.fillStyle = "white";
  context.fillRect(player['x'], player['y'], 10, 10);
}

function maxPlayersReached(msg) {
  alert('Max number of players reached ' + msg['data']);
}

function getCanvasContext() {
  return document.getElementById("game").getContext('2d');
}