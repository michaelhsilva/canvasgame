module.exports = app => {

    var players = require('./player-list').playerList;
    var allClients = require('./client-socket-list').clientList;
    
    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({ port: 3001 });

    console.log((new Date()) + ' canvasgame Web Socket server listening at %d', 3001);

    wss.broadcast = function (data) {
        wss.clients.forEach(function each(client) {
            try {
                client.send(data);
            } catch (e) {
                console.log((new Date()) + ' ' + e.message);
            }
        });
    };

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            var msg = JSON.parse(message);
            var id = msg.data.id;
            var player = null;
            for (i = 0; i < players.length; i++) {
                var p = players[i];
                if (p.clientId == id) {
                    player = p;
                    break;
                }
            }
            switch (msg.type) {
                case "keypressed":
                    if (player == null)
                        return;
                    var keypressed = parseInt(msg.data.key);
                    player.previous_x = player.x;
                    player.previous_y = player.y;
                    if (keypressed == 37) { // LEFT
                        console.log((new Date()) + ' player ' + player.color + ': LEFT');
                        if (player.x != 1)
                            player.x -= 8;
                    } else if (keypressed == 38) { // UP
                        console.log((new Date()) + ' player ' + player.color + ': UP');
                        if (player.y != 1)
                            player.y -= 8;
                    } else if (keypressed == 39) { // RIGHT
                        console.log((new Date()) + ' player ' + player.color + ': RIGHT');
                        if (player.x != 489)
                            player.x += 8;
                    } else if (keypressed == 40) { // DOWN
                        console.log((new Date()) + ' player ' + player.color + ': DOWN');
                        if (player.y != 289)
                            player.y += 8;
                    }
                    player.connected = true;
                    var newmsg = { type: 1, data: player };
                    var data = JSON.stringify(newmsg);
                    wss.broadcast(data);
                    break;
            }
        });
        ws.on('close', function (reasonCode, description) {
            var index = allClients.indexOf(ws);
            var playerDisconnected = null;
            for (i = 0; i < players.length; i++) {
                playerDisconnected = players[i];
                if (playerDisconnected.clientId == index) {
                    playerDisconnected.connected = false;
                    break;
                }
            }
            var newmsg = { type: 3, data: playerDisconnected };
            wss.broadcast(JSON.stringify(newmsg));
            console.log((new Date()) + ' client id ' + index + ' disconnected.');
        });

        allClients.push(ws);

        // associate a new available player to the new websocket connected
        var index = allClients.indexOf(ws);
        var newPlayer = null;
        for (i = 0; i < players.length; i++) {
            if (!players[i].connected) {
                players[i].clientId = index;
                newPlayer = players[i];
                break;
            }
        }
        if (newPlayer == null) {
            var newmsg = { type: 2, data: 'All available players are connected' };
            ws.send(JSON.stringify(newmsg));
        } else {
            console.log((new Date()) + ' new client id: %d', index);
            newPlayer.clientId = index;
            var newmsg = { type: 0, data: newPlayer };
            wss.broadcast(JSON.stringify(newmsg));
            for (i = 0; i < players.length; i++) {
                var otherPlayer = players[i];
                if (otherPlayer.clientId != index && otherPlayer.connected) {
                    newmsg = { type: 0, data: players[i] };
                    wss.broadcast(JSON.stringify(newmsg));
                }
            }
        }
        
    });

}