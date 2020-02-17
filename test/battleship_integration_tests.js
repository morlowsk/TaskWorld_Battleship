let expect = require('chai').expect;
let server = require('../app.js');
let request = require('supertest')(server);

describe('Game', () => {
	before(function() {
		request
			.post('/battleship/create/game');
	});

	it('should create a new game', (done) => {
		request
			.post('/battleship/create/game')
			.end((err, response) => {
				if (err) done(err);
				expect(response.statusCode).to.equal(200);
				expect(response.text).to.equal("Created new game with fresh board.");
				done();
			});
	});

	it('should be able to place a ship', (done) => {
		var req = {
			"pos": "A0",
			"shipType": "Cruiser",
			"isHorizontal": true
		};
		request
			.post('/battleship/place/ship')
			.set('Accept', 'application/json')
			.send(req)
			.end((err, response) => {
				if (err) done(err);
				expect(response.statusCode).to.equal(200);
				expect(response.body["message"]).to.equal("Placed ship of type Cruiser at position A0.");
				expect(response.body["game_status"]["message"]).to.equal("Game is not ready, not enough ships on board yet.");
				expect(response.body["game_status"]["cruisers"]).to.equal("1/2");
				done();
			});
	});

	it('should return a 400 for a bad request', (done) => {
		var req = {
			"pos": "A0",
			"shipType": "NOT A SHIP",
			"isHorizontal": true
		};
		request
			.post('/battleship/place/ship')
			.set('Accept', 'application/json')
			.send(req)
			.end((err, response) => {
				if (err) done(err);
				expect(response.statusCode).to.equal(400);
				expect(response.body["messages"][0]).to.equal("Invalid shipType");
				done();
			});
	});
});
