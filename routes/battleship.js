var express = require('express');
var router = express.Router();
let Board = require('./../game/board.js');
let Save = require('./save.js');

var game;

// get status of game
router.get('/status', function(req, res) {
	var states = game.getShipStates();
	res.send(states);
});

// create new game instance
router.post('/create/game', async function(req, res) {
	game = new Board();
	game.playingGame = true;
	var client = new Save();
	await client.deleteCollectionsInDB();
	await client.createDB();
	await client.createCollectionsInDB();
	res.send('Created new game with fresh board.');
});

// save game session
router.post('/save/game', async function(req, res) {
	await game.saveGameSession();
	res.send('Saved game session.');
});

// restore game session
router.post('/restore/game', async function(req, res) {
	await game.restoreGameSession();
	res.send('Restoring game session.');
});

// place ship
router.post('/place/ship', function(req, res) {
	var pos = req.param('pos');
	var shipType = req.param('shipType');
	var isHorizontal = req.param('isHorizontal');

	var response = {};
	var messages = validate(pos, shipType, isHorizontal);
	if (messages.length !== 0) {
		res.status(400);
		response["messages"] = messages;
	}
	else {
		response = game.placeShip(pos, shipType, isHorizontal);
	}
	res.send(response);
});

// attack on board
router.post('/attack', function(req, res) {
	var pos = req.param('pos');

	var response = {};
	var messages = validatePosition(pos);
	if (messages.length !== 0) {
		res.status(400);
		response["messages"] = messages;
	}
	else {
		response = game.attack(pos);
	}
	res.send(response);
});

function validate(pos, shipType, isHorizontal) {
	var messages = validatePosition(pos);
	var shipTypes = new Set(["Battleship", "Cruiser", "Destroyer", "Submarine"]);

	if (!shipTypes.has(shipType)) {
		messages.push("Invalid shipType.");
	}

	if (typeof isHorizontal !== "boolean"){
		messages.push("IsHorizontal is not a boolean.");
	}

	return messages;
}

function validatePosition(pos) {
	var messages = [];
	if (!pos[0].match("[A-J]")) {
		messages.push("Invalid position, letters must be A-J.");
	}
	else if (!pos[1].match("[0-9]")) {
		messages.push("Invalid position, numbers must be 0-9.");
	}
	return messages;
}

module.exports = router;
