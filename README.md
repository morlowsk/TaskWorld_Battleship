1. Clone this repo.
2. Open up untitled/ in Webstorm.
3. Go to the tests folder and run each individual test by right clicking the test file and clicking the 'Run' option.


NOTES:

- I am using MongoDB for my external database and I am using one deployed on AWS in the Eastern US Region, the key to connect to it is hard coded in my database helper class called Save.
- I am using Express as my web API framework.
- The routes are defined in battleship.js

- battleship_integration_tests.js tests calling the API endpoints which connect to the database. Especially in the last unit/integration test that saves the game in the database and then restores it.

- board_tests.js actually tests the logic of the game. All the game logic is in board.js.

- save_integration_tests.js actually tests the database helper class.

- ship.js just defines a simple class Ship, the way I designed this game the Ship class doesn't have any methods on it and it's all done via Board.

Also, the tests should be self documenting via the descriptions.

Enjoy

