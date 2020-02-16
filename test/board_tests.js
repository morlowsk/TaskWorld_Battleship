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

	describe('game simulation', function() {
		it('should be able to place all ships on board and attack them all until the game is won', function() {
			var b = new Board();
			b.playingGame = true;
			b.placeShip('A0',"Battleship", false);

			b.placeShip('A3',"Cruiser", true);
			b.placeShip('J3', 'Cruiser', true);

			b.placeShip('A8',"Destroyer", true);
			b.placeShip('D4', 'Destroyer', false);
			b.placeShip('G1', 'Destroyer', true);

			b.placeShip('C2', 'Submarine', false);
			b.placeShip('C7', 'Submarine', true);
			b.placeShip('E6', 'Submarine', false);
			b.placeShip('E8', 'Submarine', false);

			//Attack battleship
			b.attack('A0');
			b.attack('B0');
			b.attack('C0');
			var resb = b.attack('D0');
			assert.equal(resb["message"], "Battleship 0 has been sunk!");

			//Attack cruisers
			b.attack('A3');
			b.attack('A4');
			var resc1 = b.attack('A5');
			assert.equal(resc1["message"], "Cruiser 1 has been sunk!");

			b.attack('J3');
			b.attack('J4');
			var resc2 = b.attack('J5');
			assert.equal(resc2["message"], "Cruiser 2 has been sunk!");

			//Attack destroyers
			b.attack('A8');
			var resd1 = b.attack('A9');
			assert.equal(resd1["message"], "Destroyer 3 has been sunk!");

			b.attack('D4');
			var resd2 = b.attack('E4');
			assert.equal(resd2["message"], "Destroyer 4 has been sunk!");

			b.attack('G1');
			var resd3 = b.attack('G2');
			assert.equal(resd3["message"], "Destroyer 5 has been sunk!");

			//Attack submarines
			b.attack('C2');
			b.attack('D2');
			var ress1 = b.attack('E2');
			assert.equal(ress1["message"], "Submarine 6 has been sunk!");

			b.attack('C7');
			b.attack('C8');
			var ress2 = b.attack('C9');
			assert.equal(ress2["message"], "Submarine 7 has been sunk!");

			b.attack('E6');
			b.attack('F6');
			var ress3 = b.attack('G6');
			assert.equal(ress3["message"], "Submarine 8 has been sunk!");

			b.attack('E8');
			b.attack('F8');
			var ress4 = b.attack('G8');
			assert.equal(ress4["message"], "You have won the game! All ships have been sunk.");
			assert.equal(ress4["numMisses"], 0);
			assert.equal(ress4["numHits"], 28);
		});
	});
});
