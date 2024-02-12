import { GameBoard, MAX_SEQUENCE_LENGTH } from './gameboard.js';
import { changePlayer } from "./player.js";
import { AI } from "./AI.js";

class Game {
	constructor(canvas, info, tileSide) {
		this.ctx = canvas.getContext("2d");

		this.info = info;

		this.currentPlayer = { symbol: 'X', computersTurn: false };
		this.endgame = false;
		this.tileSide = tileSide;
		this.newGame();
	}

	newGame() {
		this.gameBoard = new GameBoard(this.ctx.canvas.width / this.tileSide, this.ctx.canvas.height / this.tileSide, this.tileSide, this.ctx);
		this.gameBoard.addEventListener("gameboardMoved", () => {
			this.gameBoard.drawBoard();
			this.logGameboardCoords();
		});

		this.gameBoard.drawBoard();
		this.ai = new AI(this.gameBoard);
		this.currentPlayer.symbol = 'X';

		// this.currentPlayer.computersTurn has to be changed in the code to take effect
		if (this.currentPlayer.computersTurn) {
			const centerTile = {
				x: Math.floor(this.gameBoard.canvasCols / 2),
				y: Math.floor(this.gameBoard.canvasRows / 2)
			};
			this.gameBoard.placeTile(centerTile.x, centerTile.y, this.currentPlayer.symbol);
			this.gameBoard.initStonesArea(centerTile.x, centerTile.y);
			this.gameBoard.drawTile(centerTile.x, centerTile.y, this.currentPlayer.symbol);
			this.currentPlayer = changePlayer(this.currentPlayer);
		}
	}

	processPlacedTile(tile) {
		let isWin = null;
		if ((isWin = this.gameBoard.checkForWin(tile.x, tile.y)).win) {		
			this.drawWinningSequence(isWin.winningSeq);
			this.logWinner();
			this.endgame = true;
		} else {
			this.currentPlayer = changePlayer(this.currentPlayer);
		}
	}

	drawWinningSequence(winningSeq) {
		winningSeq.forEach((e) => {
			e.x -= this.gameBoard.xOff;
			e.y -= this.gameBoard.yOff;
		});
		winningSeq.sort((a, b) => {
			let dx = a.x - b.x;
			return dx != 0 ? dx : a.y - b.y;
		});
		this.ctx.strokeStyle = "dark gray";

		this.ctx.beginPath();
		this.ctx.lineWidth = 3;
		
		const beginning = this.squareCenter(winningSeq[0].x, winningSeq[0].y);
		this.ctx.moveTo(beginning.x, beginning.y);
		
		const end = this.squareCenter(winningSeq[MAX_SEQUENCE_LENGTH - 1].x
			, winningSeq[MAX_SEQUENCE_LENGTH - 1].y);
		this.ctx.lineTo(end.x, end.y);
		this.ctx.stroke();
	}
	
	logGameboardCoords() {
		this.info.innerHTML = (() => {
			return "x: " + this.gameBoard.xOff + ", y: " + this.gameBoard.yOff;
		})();
	}
	
	logWinner() {
		this.info.innerHTML = (() => {
			return (this.currentPlayer.computersTurn ? "Computer" : "You") + 
			" won, click anywhere on the gameboard to start a new game.";
		})();
	}

	squareCenter(x, y) {
		return {
			x: x * this.tileSide + Math.floor(this.tileSide / 2),
			y: y * this.tileSide + Math.floor(this.tileSide / 2)
		};
	}
	
	computersTurn() {
		const aiPos = this.ai.selectBestPlace(this.currentPlayer.symbol);
		
		let gbOff = {x: 0, y: 0};
		if ((gbOff.x = aiPos.x - this.gameBoard.xOff) < 0) {
			this.gameBoard.addOffset(gbOff.x, 0);
		} else if ((gbOff.x = this.gameBoard.canvasCols - 1 + this.gameBoard.xOff - aiPos.x) < 0) {
			this.gameBoard.addOffset(-gbOff.x, 0);
		}
		if ((gbOff.y = aiPos.y - this.gameBoard.yOff) < 0) {
			this.gameBoard.addOffset(0, gbOff.y);
		} else if ((gbOff.y = this.gameBoard.canvasRows - 1 + this.gameBoard.yOff - aiPos.y) < 0) {
			this.gameBoard.addOffset(0, -gbOff.y);
		}

		this.gameBoard.placeTile(aiPos.x, aiPos.y, this.currentPlayer.symbol);
		this.gameBoard.drawTile(aiPos.x, aiPos.y, this.currentPlayer.symbol);
		this.processPlacedTile(aiPos);
	}
}

export { Game };