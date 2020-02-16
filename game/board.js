let Ship = require('./ship.js');

module.exports = class Board {
	constructor() {
		this.board = [];
		for (let i=0; i<10; i++) {
			this.board[i] = [];
			for (let j=0; j<10; j++) {
				this.board[i].push('')
			}
		}

		this.positionsToShip = {};
		this.rowMap = {
			'A': 0,
			'B': 1,
			'C': 2,
			'D': 3,
			'E': 4,
			'F': 5,
			'G': 6,
			'H': 7,
			'I': 8,
			'J': 9
		};
		this.convert = function(position) {
			var x = this.rowMap[position[0]];
			var y = parseInt(position[1]);
			return [x, y];
		};

		this.numToRow = {
			0 : 'A',
			1 : 'B',
			2 : 'C',
			3 : 'D',
			4 : 'E',
			5 : 'F',
			6 : 'G',
			7 : 'H',
			8 : 'I',
			9 : 'J'
		};

		this.ships = [];
		this.numBattleShips = 4;
		this.numCruisers = 2;
		this.numDestroyers = 3;
		this.numSubmarines = 3;

		this.id = 0;
		this.createId = function () {
			return this.id++;
		};

		this.checkIfSunk = function(s) {
			var position = this.convert(s.startPosition);
			if (s.isHorizontal) {
				for (let j=position[1]; j < position[1]+s.size; j++) {
					if (this.board[position[0]][j] !== 'X') {
						return false;
					}
				}
				return true;
			}
			else {
				for (let i=position[0]; i < position[0]+s.size; i++) {
					if (this.board[i][position[1]] !== 'X') {
						return false;
					}
				}
				return true;
			}
		};

		this.place = function(startPosition, isHorizontal, size, shipType, symbol) {
			var pos = this.convert(startPosition);
			var x = pos[0];
			var y = pos[1];

			var ship = new Ship(this.createId(), shipType, isHorizontal, startPosition, size);

			if (isHorizontal) {
				for (let j=y; j < y+size; j++) {
					this.board[x][j] = symbol;
					this.positionsToShip[startPosition[0] + j] = ship;
				}
			}
			else {
				for (let i=x; i < x+size; i++) {
					this.board[i][y] = symbol;
					this.positionsToShip[this.numToRow[i] + y] = ship;
				}
			}

			this.ships.push(ship);
		};

		this.canPlace = function (startPosition, shipType, isHorizontal) {
			var pos = this.convert(startPosition);
			var x = pos[0];
			var y = pos[1];

			var size;
			switch (shipType) {
				case 'Battleship': size = 4; break;
				case 'Cruiser': size = 3; break;
				case 'Destroyer': size = 2; break;
				default: size = 3;
			}

			if (isHorizontal) {
				if (y+size > this.board[0].length) {
					return false;
				}
				if (this.board[x][y-1] !== '' || this.board[x][y+size] !== '') {
					return false;
				}
				for (let j=y; j < y+size; j++) {
					if (this.board[x][j] !== '') {
						return false;
					}
				}

				return true;
			}
			else {
				if (x+size > this.board.length) {
					return false;
				}
				if ((x-1 < 0 || this.board[x-1][y] !== '') || this.board[x+size][y] !== '') {
					return false;
				}
				for (let i=x; i < x+size; i++) {
					if (this.board[i][y] !== '') {
						return false;
					}
				}

				return true;
			}
		}
	}

	placeShip(startPosition, shipType, isHorizontal) {
		if (this.canPlace(startPosition, shipType, isHorizontal)) {
			if (shipType === 'Battleship') {
				this.place(startPosition, isHorizontal, 4, shipType, 'B');
				this.numBattleShips--;
			}
			else if (shipType === 'Cruiser') {
				this.place(startPosition, isHorizontal, 3, shipType, 'C');
				this.numCruisers--;
			}
			else if (shipType === 'Destroyer') {
				this.place(startPosition, isHorizontal, 2, shipType, 'D');
				this.numDestroyers--;
			}
			else {
				this.place(startPosition, isHorizontal, 3, shipType, 'S');
				this.numSubmarines--;
			}
		}
		else {
			return { "message":  "Cannot place ship of type " + shipType + " at position "+ startPosition + "."};
		}

		return { "message": "Placed ship of type " + shipType };
	}

	attack(position) {
		var pos = this.convert(position);
		var x = pos[0];
		var y = pos[1];

		//miss
		if (this.board[x][y] === '' || this.board[x][y] === 'X') {
			return { "message" : "Missed!" };
		}
		//hit
		else {
			this.board[x][y] = 'X';
			var s = this.positionsToShip[position];
			s.isHit = true;
			if (this.checkIfSunk(s)) {
				s.isSunk = true;
				return { "message" : s.shipType + " " + s.id + " has been sunk!" };
			}
			else {
				return { "message" : "Hit!" };
			}
		}
	}

	getShipStates() {
		var battleShips = this.ships
			.filter(function (s) { return s.shipType === "Battleship"})
			.filter(function (s) { return !s.isSunk } );
		var cruisers = this.ships
			.filter(function (s) { return s.shipType === "Cruiser"})
			.filter(function (s) { return !s.isSunk  } );
		var destroyers = this.ships
			.filter(function (s) { return s.shipType === "Destroyer"})
			.filter(function (s) { return !s.isSunk  } );
		var submarines = this.ships
			.filter(function (s) { return s.shipType === "Submarine"})
			.filter(function (s) { return !s.isSunk  } );

		var sunkShips = this.ships.filter(function (s) { return s.isSunk  } );
		return {
			"numSunkShips": sunkShips.length,
			"activeBattleShips": battleShips.length,
			"activeCruisers": cruisers.length,
			"activeDestroyers": destroyers.length,
			"activeSubmarines": submarines.length
		};
	}
};
