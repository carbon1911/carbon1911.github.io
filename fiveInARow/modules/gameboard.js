import { directions } from "./direction.js";

const MAX_SEQUENCE_LENGTH = 5;

class GameBoard extends EventTarget {
	constructor(canvasCols, canvasRows, squareSide, drawingContext) {
		if (canvasRows < MAX_SEQUENCE_LENGTH && canvasCols < MAX_SEQUENCE_LENGTH) {
			throw Error("The gameboard is too low to fit a winning sequence.");
		}
		super();
		this.squareSide = squareSide;
		this.ctx = drawingContext;
		this.board = {};
		this.resizeAndDraw(canvasCols, canvasRows);
		this.xOff = 0;
		this.yOff = 0;
		this.topLeftCoord = null;
		this.bottRightCoord = null;
	}

	
	drawBoard() {
		this.ctx.fillStyle = "silver";
		this.ctx.strokeStyle = "grey";

		this.ctx.fillRect(0, 0, this.canvasCols * this.squareSide, this.canvasRows * this.squareSide);
		
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		for (let x = 1; x < this.canvasCols; ++x) {
			this.ctx.moveTo(x * this.squareSide, 0);
			this.ctx.lineTo(x * this.squareSide, this.canvasRows * this.squareSide);
		}
		
		for (let y = 1; y < this.canvasRows; ++y) {
			this.ctx.moveTo(0, y * this.squareSide);
			this.ctx.lineTo(this.canvasCols * this.squareSide, y * this.squareSide);
		}
		this.ctx.stroke();

		// draw tiles
		for (let y = this.yOff; y < this.canvasRows + this.yOff; ++y) {
			for (let x = this.xOff; x < this.canvasCols + this.xOff; ++x) {
				if (this.at(x, y) == undefined) {
					continue;
				}
				this.drawTile(x, y, this.at(x, y));
			}
		}
	}

	at(x, y) {
		return this.board[[x, y]];
	}

	isEmpty() {
		return Object.entries(this.board) == 0;
	}

	resizeAndDraw(newCols, newRows) {
		this.canvasCols = newCols;
		this.canvasRows = newRows;
		this.drawBoard();
	}

	addOffset(x, y) {
		this.xOff += x;
		this.yOff += y;
		this.dispatchEvent(new CustomEvent("gameboardMoved"));
	}

	resetOffset() {
		this.addOffset(-this.xOff, -this.yOff);
	}

	offRight() {
		this.addOffset(-1, 0);
	}

	offLeft() {
		this.addOffset(1, 0);
	}

	offUp() {
		this.addOffset(0, -1);
	}

	offDown() {
		this.addOffset(0, 1);
	}

	initStonesArea(x, y) {
		this.topLeftCoord = { x: x, y: y };
		this.bottRightCoord = { x: x, y: y };
	}

	placeTile(x, y, symbol) {
		if (this.at(x, y) != undefined) {
			return null;
		}
		this.board[[x, y]] = symbol;
		if (this.bottRightCoord == null) {
			this.initStonesArea(x, y);
		}
		if (x > this.bottRightCoord.x) {
			this.bottRightCoord.x = x;
		} else if (x < this.topLeftCoord.x) {
			this.topLeftCoord.x = x;
		}
		if (y > this.bottRightCoord.y) {
			this.bottRightCoord.y = y;
		} else if (y < this.topLeftCoord.y) {
			this.topLeftCoord.y = y;
		}
		return { x: x, y: y };
	}

	drawTile(x, y, symbol) {
		this.ctx.fillStyle = symbol === 'X' ? "firebrick" : "royalblue";
		this.ctx.fillRect(
			(x - this.xOff) * this.squareSide + 1, (y - this.yOff) * this.squareSide + 1
			, this.squareSide - 2, this.squareSide - 2
		);
	}
	
	checkForWin(x, y) {
		const playersSymbol = this.at(x, y);
		const fourDirs = ['W', 'NW', 'N', 'NE'];
		let winningSeqIndices = [];
		for (let dir in fourDirs) {
			let currSeqLen = 0;
			let dirsList = GameBoard.directionsIndicesList(fourDirs[dir], x, y);
			for (let tile in dirsList) {
				currSeqLen = GameBoard.checkNextTile(currSeqLen, playersSymbol
					, this.at(dirsList[tile].x, dirsList[tile].y));
				if (currSeqLen != 0) {
					winningSeqIndices.push({ x: dirsList[tile].x, y: dirsList[tile].y});
				} else {
					winningSeqIndices.length = 0;
				}
				if (currSeqLen == MAX_SEQUENCE_LENGTH) {
					return {
						win: true,
						winningSeq: winningSeqIndices
					};
				}	
			}
		}
		return false;
	}
	
	static checkNextTile(currSeqLen, chckdSymbol, currSymbol) {
		return chckdSymbol == currSymbol ? ++currSeqLen : 0;
	}

	static directionsIndicesList(direction, xPos, yPos) {
		let dil = [];
		const directionVector = directions[direction];
		for (let i = -MAX_SEQUENCE_LENGTH + 1; i < MAX_SEQUENCE_LENGTH; ++i) {
			dil.push({ x: directionVector.x * i + xPos, y: directionVector.y * i + yPos });
		}
		return dil;
	}
}

export { GameBoard, MAX_SEQUENCE_LENGTH };