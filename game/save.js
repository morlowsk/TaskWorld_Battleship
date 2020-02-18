var MongoClient = require('mongodb').MongoClient;
var url
	= "mongodb+srv://dbUser:taskworld123@taskworldapp-pzqk5.mongodb.net/Battleship?retryWrites=true&w=majority";

module.exports = class Save {
	createDB() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(url, function(err, db) {
				if (err) reject(err);
				console.log("Database created!");
				db.close();
				resolve();
			});
		});
	}

	createCollectionsInDB() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(url, function(err, db) {
				if (err) reject(err);
				var dbo = db.db("Battleship");
				dbo.createCollection("ships", function(err, res) {
					if (err) throw err;
					console.log("Collection created!");
					dbo.createCollection("metadata", function(err, res) {
						if (err) reject(err);
						console.log("Collection created!");
						db.close();
						resolve();
					});
				});
			});
		});
	}

	deleteCollectionsInDB() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(url, function(err, db) {
				if (err) reject(err);
				var dbo = db.db("Battleship");
				dbo.collection("ships", function(err, collection) {
					if (err) reject(err);
					collection.deleteMany({}, function(err, result) {
						if (err) reject(err);
						console.log("ships is deleted! "+result);
						dbo.collection("metadata", function(err, collection) {
							if (err) reject(err);
							collection.deleteMany({}, function(err, result) {
								if (err) reject(err);
								console.log("metadata is deleted! "+result);
								db.close();
								resolve();
							});
						});
					});
				});
			});
		});
	}

	writeToDB(ships, metadata) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(url, function(err, db) {
				if (err) reject(err);
				var dbo = db.db("Battleship");
				dbo.collection("ships").insertMany(ships, function(err, res) {
					if (err) reject(err);
					console.log("All inserted ships placed.");
					dbo.collection("metadata").insertOne(metadata, function(err, res) {
						if (err) reject(err);
						console.log("All metadata inserted.");
						db.close();
						resolve();
					});
				});
			});
		});
	}

	readFromDB() {
		return new Promise((resolve, reject) => {
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("Battleship");
				dbo.collection("ships").find({}).toArray(function(err, ships) {
					if (err) throw err;
					console.log(ships);
					dbo.collection("metadata").find({}).toArray(function(err, metadata) {
						if (err) throw err;
						console.log(metadata);
						db.close();
						resolve({ ships, metadata: metadata[0] });
					});
				});
			});
		});
	}
};
