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

		this.totalHits = 0;
		this.totalMisses = 0;

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

		this.numBattleShips = 1;
		this.battleShipsPlaced = 0;
		this.numCruisers = 2;
		this.cruisersPlaced = 0;
		this.numDestroyers = 3;
		this.destroyersPlaced = 0;
		this.numSubmarines = 4;
		this.submarinesPlaced = 0;

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

			var rowStart;
			var rowEnd;
			var columnStart;
			var columnEnd;

			if (isHorizontal) {
				rowStart = x-1 >= 0 ? x-1 : x;
				rowEnd = x+1 < this.board.length ? x + 1 : x;
				columnStart = y-1 >= 0 ? y-1 : y;
				columnEnd = y+size-1;

				if (columnEnd > this.board[0].length) {
					return false;
				}
			}
			else {
				rowStart = x-1 >= 0 ? x-1 : x;
				rowEnd = x+size-1;
				if (rowEnd > this.board.length) {
					return false;
				}
				columnStart = y-1 >= 0 ? y-1 : y;
				columnEnd = y+1 < this.board[0].length ? y+1 : y;
			}

			for (let i=rowStart; i <= rowEnd; i++) {
				for (let j=columnStart; j <= columnEnd; j++) {
					if (this.board[i][j] !== '') {
						return false;
					}
				}
			}

			return true;
		}
	}

	placeShip(startPosition, shipType, isHorizontal) {
		if (this.canPlace(startPosition, shipType, isHorizontal)) {
			if (shipType === 'Battleship') {
				this.place(startPosition, isHorizontal, 4, shipType, 'B');
				this.battleShipsPlaced++;
			}
			else if (shipType === 'Cruiser') {
				this.place(startPosition, isHorizontal, 3, shipType, 'C');
				this.cruisersPlaced++;
			}
			else if (shipType === 'Destroyer') {
				this.place(startPosition, isHorizontal, 2, shipType, 'D');
				this.destroyersPlaced++;
			}
			else {
				this.place(startPosition, isHorizontal, 3, shipType, 'S');
				this.submarinesPlaced++;
			}
		}
		else {
			return { "message":  "Cannot place ship of type " + shipType + " at position "+ startPosition + "."};
		}

		var response = {};

		if (this.numBattleShips === this.battleShipsPlaced
			&& this.numCruisers === this.cruisersPlaced
			&& this.numDestroyers === this.destroyersPlaced
			&& this.numSubmarines === this.submarinesPlaced) {
			response["game_status"] = "Game is ready, all ships placed on board.";
		}
		else {
			response["game_status"] =
				{   "message" : "Game is not ready, not enough ships on board yet.",
				    "battleships": this.battleShipsPlaced + "/" + this.numBattleShips,
					"cruisers": this.cruisersPlaced + "/" + this.numCruisers,
					"destroyers": this.destroyersPlaced + "/" + this.numDestroyers,
					"submarines": this.submarinesPlaced + "/" + this.numSubmarines
				}
		}

		response["message"] = "Placed ship of type " + shipType + " at position "+ startPosition + ".";
		return response;
	}

	attack(position) {
		var pos = this.convert(position);
		var x = pos[0];
		var y = pos[1];

		//miss
		if (this.board[x][y] === '' || this.board[x][y] === 'X') {
			this.totalMisses++;
			return { "message" : "Missed!" };
		}
		//hit
		else {
			this.board[x][y] = 'X';
			this.totalHits++;
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
