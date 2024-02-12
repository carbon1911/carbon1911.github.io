import { Game } from "./game.js";

const TILE_SIDE = 40;

window.onload = () => {
	let canvas = document.getElementById("mainCanvas");
	let info = document.getElementById("info");
	setCanvasSize(canvas, info);

	let game = new Game(canvas, info, TILE_SIDE);

	window.onresize = () => {
		windowResChanged(canvas, info, game);
	}

	window.onorientationchange = () => {
		windowResChanged(canvas, info, game);
	}

	canvas.addEventListener("mousedown", mouseClicked(canvas, info, game));

	document.getElementById("up").addEventListener("mousedown", moveGameboard(game));
	document.getElementById("down").addEventListener("mousedown", moveGameboard(game));
	document.getElementById("left").addEventListener("mousedown", moveGameboard(game));
	document.getElementById("right").addEventListener("mousedown", moveGameboard(game));

	document.getElementById("reset").addEventListener("mousedown", resetGameBoard(game));
}

function mouseToCanvasCoords(evt, canvas) {
	const rect = canvas.getBoundingClientRect();
	return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function mouseToGameBoard(coords, gameBoard) {
	return {
		x: (coords.x - coords.x % TILE_SIDE) / TILE_SIDE + gameBoard.xOff,
		y: (coords.y - coords.y % TILE_SIDE) / TILE_SIDE + gameBoard.yOff
	};
}

function resetGameBoard(game) {
	return (evt) => {
		if (game.endgame) {
			return;
		}
		game.gameBoard.resetOffset();
	}
}

function mouseClicked(canvas, info, game) {
	return (evt) => {
		game.logGameboardCoords(game.gameBoard);
		if (game.endgame) {
			info.innerHTML = "x: 0, y: 0";
			game.endgame = false;
			game.newGame();
			return;
		}
		if (game.gameBoard == null) {
			throw Error("Can't place a tile on a gameboard that is null.");
		}

		const gameBoardPos = mouseToGameBoard(mouseToCanvasCoords(evt, canvas), game.gameBoard);
		if (game.gameBoard.placeTile(gameBoardPos.x, gameBoardPos.y, game.currentPlayer.symbol) != null) {
			game.gameBoard.drawTile(gameBoardPos.x, gameBoardPos.y, game.currentPlayer.symbol);
			game.processPlacedTile(gameBoardPos);
			if (!game.endgame) {
				game.computersTurn();
			}
		}
	}
}

function moveGameboard(game) {
	return (evt) => {
		if (game.endgame) {
			return;
		}
		if (evt.currentTarget.id == "up") {
			game.gameBoard.offUp();
		} else if (evt.currentTarget.id == "down") {
			game.gameBoard.offDown();
		} else if (evt.currentTarget.id == "left") {
			game.gameBoard.offLeft();
		} else if (evt.currentTarget.id == "right") {
			game.gameBoard.offRight();
		}
	}
}

function windowResChanged(canvas, infoPar, game) {
	setCanvasSize(canvas, infoPar);
	game.gameBoard.resizeAndDraw(canvas.width / TILE_SIDE, canvas.height / TILE_SIDE);
	if (game.gameBoard.canvasCols <= 0 || game.gameBoard.canvasRows <= 0) {
		infoPar.innerHTML = "Rotate the device to continue playing.";
	} else if (game.gameBoard.isEmpty()) {
		infoPar.innerHTML = "Click on the gameboard to place the initial tile.";
	} else {
		game.logGameboardCoords();
	}
}

function setCanvasSize(canvas, infoPar) {
	let iconBar = document.getElementById("icon-bar");
	const rect = iconBar.getBoundingClientRect();
	let horzMargin = TILE_SIDE + parseFloat(window.getComputedStyle(iconBar).getPropertyValue('width')) + rect.left;

	horzMargin += (window.innerWidth - horzMargin) % TILE_SIDE;
	canvas.width = window.innerWidth - horzMargin;
	canvas.style.marginLeft = (parseFloat(window.getComputedStyle(iconBar).getPropertyValue('width')) + rect.left).toString() + "px";

	let vertMargin = TILE_SIDE + infoPar.clientHeight + 2 * parseFloat(window.getComputedStyle(infoPar)
					.getPropertyValue('margin')) + 150; // 150 is the height of the arrows
	vertMargin += (window.innerHeight - vertMargin) % TILE_SIDE;
	canvas.height = window.innerHeight - vertMargin;
}