let expect = require('chai').expect;
let server = require('../app.js');
let request = require('supertest')(server);

describe('Game', () => {
	it('should create a new game', (done) => {
		request.post('/battleship/create/game').end((err, response) => {
			if (err) done.fail(err);
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

		request.post('/battleship/create/game').end((err) => {
			if (err) done.fail(err);
			request
				.post('/battleship/place/ship')
				.set('Accept', 'application/json')
				.send(req)
				.end((err, response) => {
					if (err) done.fail(err);
					expect(response.statusCode).to.equal(200);
					expect(response.body["message"]).to.equal("Placed ship of type Cruiser at position A0.");
					expect(response.body["game_status"]["message"]).to.equal("Game is not ready, not enough ships on board yet.");
					expect(response.body["game_status"]["cruisers"]).to.equal("1/2");
					done();
				});
		});
	});

	it('should return a 400 for a bad request and the reasons why', (done) => {
		var req = {
			"pos": "Z0",
			"shipType": "NOT A SHIP",
			"isHorizontal": "not a boolean"
		};
		request.post('/battleship/create/game').end((err) => {
			if (err) done.fail(err);
			request
				.post('/battleship/place/ship')
				.set('Accept', 'application/json')
				.send(req)
				.end((err, response) => {
					if (err) done.fail(err);
					expect(response.statusCode).to.equal(400);
					expect(response.body["messages"][0]).to.equal("Invalid position, letters must be A-J.");
					expect(response.body["messages"][1]).to.equal("Invalid shipType.");
					expect(response.body["messages"][2]).to.equal("IsHorizontal is not a boolean.");
					done();
				});
		});
	});

	it('should be able to place a ship, save the game, restore the game and attack the same ship', (done) => {
		var req = {
			"pos": "A0",
			"shipType": "Cruiser",
			"isHorizontal": true
		};
		request.post('/battleship/create/game').end((err) => {
			if (err) done.fail(err);
			request
				.post('/battleship/place/ship').set('Accept', 'application/json').send(req).end((err) => {
				if (err) done.fail(err);
				request.post('/battleship/save/game').send(req).end((err) => {
					if (err) done.fail(err);
					request.post('/battleship/restore/game').end((err) => {
						if (err) done.fail(err);
						var coord = { "pos": "A0" };
						request.post('/battleship/attack/ship').set('Accept', 'application/json').send(coord).end((err, response) => {
							if (err) done.fail(err);
							expect(response.statusCode).to.equal(200);
							expect(response.body["message"]).to.equal("Hit!");
							done();
						});
					});
				});
			});
		});
	});
});
