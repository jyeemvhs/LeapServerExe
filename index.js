var io = require('socket.io')(process.env.PORT || 3006);
//var io = require('socket.io')(process.env.PORT || 52300);
var Player = require('./Player');
var RowCol = require('./RowCol');

console.log('Server has started');

var players = [];
var sockets = [];



/*
	let boardData = {board:
"111111111111111111111
 100000000000000111111
 101111111101110000111
 100001111101111110111
 111101111100000000111
 111101111101111110111
 111100000001111110111
 111111011111111110111
 111111011111111110111
 111111000000011110111
 100000011111011110111
 101111011111011110111
 101111011111000000111
 101111011111011011111
 101111011111011011111
 100000000000011011111
 111111011111111011111
 111111000011111011111
 111111000000000011111
 111111000011111111111
 111111111111111111111"};
*/

	let boardData = {board:
"111111111111111111111100000000000000111111101111111101110000111100001111101111110111111101111100000000111111101111101111110111111100000001111110111111111011111111110111111111011111111110111111111000000011110111100000011111011110111101111011111011110111101111011111000000111101111011111011011111101111011111011011111100000000000011011111111111011111111011111111111000011111011111111111000000000011111111111000011111111111111111111111111111111"};


function randomLoc() {
	let pos = new RowCol();
	while (true) { 
		pos.col = Math.floor((Math.random() * 21) + 0);
		pos.row = Math.floor((Math.random() * 21) + 0);
		if (boardData.board[pos.col+21*pos.row] == '0') {
			return (pos);
		}
	}
	
} 


io.on('connection',function(socket) {
	console.log('Connection Made');


	var coin = new RowCol();

	var player = new Player();
	var thisPlayerID = player.id;
	players[thisPlayerID] = player;
	sockets[thisPlayerID] = socket;

//Tell the client that this is our id for the server.
	socket.emit('register',{id:thisPlayerID});     //going from server to client.
	socket.emit('spawn',player);   //Tell myself that I have spawned.
	socket.broadcast.emit('spawn',player);  //Tell everyone else that I have spawned.
	socket.emit('boardInfo',boardData);

	coin = randomLoc();
	socket.emit('setCoinPos',coin);

//Tell myself about everyone else in the game.
	for (var playerID in players) {
		if (playerID != thisPlayerID) {
			socket.emit('spawn',players[playerID]);
		}
	}

	socket.on('coinCollected',function(data) {
		coin = randomLoc();
		socket.emit('setCoinPos',coin);
		socket.broadcast.emit('setCoinPos',coin);
	});

//Positional data from client.
	socket.on('updatePosition',function(data) {
		player.position.x = data.position.x;
		player.position.y = data.position.y;
//console.log("updatePosition");
		socket.broadcast.emit('updatePosition',player);
	});
	
	socket.on('updateRotation',function(data) {
		player.rotation.w = data.rotation.w;
		player.rotation.x = data.rotation.x;
		player.rotation.y = data.rotation.y;
		player.rotation.z = data.rotation.z;
//console.log("updateRotation");

		socket.broadcast.emit('updateRotation',player);
	});


	socket.on('disconnect',function() {
		console.log('A player has disconnected');
		delete players[thisPlayerID];
		delete sockets[thisPlayerID];
		socket.broadcast.emit('disconnected',player);
	});



});