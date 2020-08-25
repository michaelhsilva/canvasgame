  $(function(){
    $("#canvasWrapper").focus();
  });

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
      var msg = JSON.parse(event.data);
      var type = parseInt(msg['type']);
      
      switch (type) {
      case 0: // player connected
      case 1: // new position
        var player = msg['data'];
        if (clientId == null) {
            clientId = player.clientId;
        }
        var myCanvas = document.getElementById("game");
        var context = myCanvas.getContext("2d");

        context.fillStyle = "white";
        context.fillRect(player['previous_x'], player['previous_y'], 10, 10);
        context.fillStyle = player['color'];
        context.fillRect(player['x'], player['y'], 10, 10);
        break;
      case 2: // max players reached
        alert(msg['data']);
        break;
      case 3: // player disconnected
        var player = msg['data'];
        var myCanvas = document.getElementById("game");
        var context = myCanvas.getContext("2d");

        context.fillStyle = "white";
        context.fillRect(player['x'], player['y'], 10, 10);
        break;
      }
  };
