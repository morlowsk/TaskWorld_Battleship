var assert = require('assert');
let Board = require('./../game/board.js');

describe('Board', function() {
	describe('placeShip', function() {
		it('should be able to place a horizontal Battleship on an empty board', function() {
			var b = new Board();
			var message = b.placeShip('B3',"Battleship", false);
			var states = b.getShipStates();
			assert.equal(message["message"], "Placed ship of type Battleship at position B3.");
			assert.equal(states["activeBattleShips"], 1);
		});

		it('should be able to place a vertical Battleship on an empty board', function() {
			var b = new Board();
			var message = b.placeShip('B3',"Battleship", true);
			var states = b.getShipStates();
			assert.equal(message["message"], "Placed ship of type Battleship at position B3.");
			assert.equal(states["activeBattleShips"], 1);
		});

		it('should NOT be able to place a ship next to another ship from the top', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var message = b.placeShip('A3',"Battleship", false);
			assert.equal(message["message"], "Cannot place ship of type Battleship at position A3.");
		});

		it('should NOT be able to place a ship next to another ship from the bottom', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var message = b.placeShip('F3',"Battleship", false);
			assert.equal(message["message"], "Cannot place ship of type Battleship at position F3.");
		});

		it('should NOT be able to place a ship next to another ship from the right side', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var message = b.placeShip('B4',"Battleship", false);
			assert.equal(message["message"], "Cannot place ship of type Battleship at position B4.");
		});

		it('should NOT be able to place a ship next to another ship from the left side', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var message = b.placeShip('B2',"Battleship", false);
			assert.equal(message["message"], "Cannot place ship of type Battleship at position B2.");
		});

		it('should NOT be able to place a ship on another ship', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var message = b.placeShip('C3',"Battleship", false);
			assert.equal(message["message"], "Cannot place ship of type Battleship at position C3.");
		});

		it('should be able to place all ships on board in order to start game', function() {
			var b = new Board();
			b.placeShip('A0',"Battleship", false);

			b.placeShip('A3',"Cruiser", true);
			b.placeShip('J3', 'Cruiser', true);

			b.placeShip('A8',"Destroyer", true);
			b.placeShip('D4', 'Destroyer', false);
			b.placeShip('G1', 'Destroyer', true);

			b.placeShip('C2', 'Submarine', false);
			b.placeShip('C7', 'Submarine', true);
			b.placeShip('E6', 'Submarine', false);
			var response = b.placeShip('E8', 'Submarine', false);

			assert.equal(response["game_status"], "Game is ready, all ships placed on board.");
		});
	});

	describe('attack', function() {
		it('should be able to attack a Battleship and miss if the wrong spot is chosen', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var attackMessage = b.attack('A3');
			var states = b.getShipStates();
			assert.equal(attackMessage['message'], "Missed!");
			assert.equal(states["activeBattleShips"], 1);
		});

		it('should be able to attack a Battleship and miss if the same spot is chosen again', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			b.attack('B3');
			var attackMessage = b.attack('B3');
			var states = b.getShipStates();
			assert.equal(attackMessage['message'], "Missed!");
			assert.equal(states["activeBattleShips"], 1);
		});

		it('should be able to attack a Battleship and it should still be active after one shot', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			var attackMessage = b.attack('B3');
			var states = b.getShipStates();
			assert.equal(attackMessage['message'], "Hit!");
			assert.equal(states["activeBattleShips"], 1);
		});

		it('should be able to attack a Battleship four times and it should be sunk', function() {
			var b = new Board();
			b.placeShip('B3',"Battleship", false);
			b.attack('B3');
			b.attack('C3');
			b.attack('D3');
			var finalMessage = b.attack('E3');
			var states = b.getShipStates();
			assert.equal(finalMessage['message'], "Battleship 0 has been sunk!");
			assert.equal(states["numSunkShips"], 1);
			assert.equal(states["activeBattleShips"], 0);
		});
	});
});
