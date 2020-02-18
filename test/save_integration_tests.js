var assert = require('assert');
let Save = require('./../game/save.js');

describe('Save', () => {
	it('should be able to write to db and then read from it', async () => {
		var client = new Save();
		//create db and collections
		await client.deleteCollectionsInDB();
		await client.createDB();
		await client.createCollectionsInDB();

		var ships = [{  "id": 1,
						"shipType": "Battleship",
						"isHorizontal": true,
						"startPosition": "A0",
						"size": 4,
						"isHit": true,
						"isSunk": false
					 }
		];
		var metadata = { "board": "[]",
						"numHits": 0,
						"numMisses": 1,
						"battleShipsPlaced": 1,
						"cruisersPlaced": 0,
						"destroyersPlaced": 0,
						"submarinesPlaced": 0
		};
		await client.writeToDB(ships, metadata);

		var result = await client.readFromDB();

		//assert ship
		assert.equal(result.ships[0]["id"], 1);
		assert.equal(result.ships[0]["shipType"], "Battleship");
		assert.equal(result.ships[0]["isHorizontal"], true);
		assert.equal(result.ships[0]["startPosition"], "A0");
		assert.equal(result.ships[0]["size"], 4);
		assert.equal(result.ships[0]["isHit"], true);
		assert.equal(result.ships[0]["isSunk"], false);

		//assert metadata
		assert.equal(result.metadata.board, "[]");
		assert.equal(result.metadata.numHits, 0);
		assert.equal(result.metadata.numMisses, 1);
		assert.equal(result.metadata.battleShipsPlaced, 1);
		assert.equal(result.metadata.cruisersPlaced, 0);
		assert.equal(result.metadata.destroyersPlaced, 0);
		assert.equal(result.metadata.submarinesPlaced, 0);

		await client.deleteCollectionsInDB();
	}).timeout(10000);;
});
