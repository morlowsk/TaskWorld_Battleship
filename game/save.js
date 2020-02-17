var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/BattleShip";

module.exports = class Save {
	createDB() {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			console.log("Database created!");
			db.close();
		});
	}

	createCollectionsInDB() {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("BattleShip");
			dbo.createCollection("ships", function(err, res) {
				if (err) throw err;
				console.log("Collection created!");
				db.close();
			});

			dbo.createCollection("metadata", function(err, res) {
				if (err) throw err;
				console.log("Collection created!");
				db.close();
			});
		});
	}

	writeToDB(ships, metadata) {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("Battleship");
			dbo.collection("ships").insertMany(ships, function(err, res) {
				if (err) throw err;
				console.log("All inserted ships placed.");
				db.close();
			});

			dbo.collection("metadata").insertOne(metadata, function(err, res) {
				if (err) throw err;
				console.log("All metadata inserted.");
				db.close();
			});
		});
	}

	readFromDB() {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("Battleship");
			var ships = dbo.collection("ships").find({}).toArray(function(err, result) {
				if (err) throw err;
				console.log(result);
				db.close();
			});

			var metadata = dbo.collection("metadata").find({}).toArray(function(err, result) {
				if (err) throw err;
				console.log(result);
				db.close();
			});

			return { "ships": ships, "metadata": metadata };
		});
	}
};
