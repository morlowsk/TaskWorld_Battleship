var express = require('express');
var router = express.Router();
let Board = require('./../game/board.js');

var game;

// get status of game
router.get('/status', function(req, res) {
	var states = game.getShipStates();
	res.send(states);
});

// create new game instance
router.post('/create/game', function(req, res) {
	game = new Board();
	res.send('Created new game with fresh board.');
});

// place ship
router.post('/place/ship', function(req, res) {
	var pos = req.param('pos');
	var shipType = req.param('shipType');
	var isHorizontal = req.param('isHorizontal');
	var response = game.placeShip(pos, shipType, isHorizontal);
	res.send(response);
});

// attack on board
router.post('/attack', function(req, res) {
	var pos = req.param('pos');
	var response = game.attack(pos);
	res.send(response);
});

module.exports = router;
