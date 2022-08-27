import { other } from "./player.js";
import { Sequence, compareSeqs } from "./sequence.js";
import { MAX_SEQUENCE_LENGTH } from "./gameboard.js";
import { opposite, directions } from "./direction.js";

// TODO:
//		* add comments

class AI {
	constructor(gameboard) {
		this.gameboard = gameboard;
	}

	selectBestPlace(computersSymbol) {
		let oppsMaxSeqs = [new Sequence(0, false, false)];
		let myMaxSeqs = [new Sequence(0, false, false)];
		let myCurrSeqs, oppsCurrSeqs;
		let targetPosition = { x: null, y: null };

		const topLeftCoord = {
			x: this.gameboard.topLeftCoord.x - 1,
			y: this.gameboard.topLeftCoord.y - 1
		}
		
		const bottRightCoord = {
			x: this.gameboard.bottRightCoord.x + 1,
			y: this.gameboard.bottRightCoord.y + 1
		}

		for (let y = topLeftCoord.y; y <= bottRightCoord.y; ++y) {
			for (let x = topLeftCoord.x; x <= bottRightCoord.x; ++x) {
				if (this.gameboard.at(x, y) != undefined) {
					continue;
				}

				myCurrSeqs = this.getPlayersSequences(x, y, computersSymbol, other(computersSymbol));
				oppsCurrSeqs = this.getPlayersSequences(x, y, other(computersSymbol), other(computersSymbol));

				if (compareSeqs(myCurrSeqs, myMaxSeqs) > 0) {
					myMaxSeqs = myCurrSeqs;
					if (myMaxSeqs[0].len > oppsMaxSeqs[0].len) {
						targetPosition = { x: x, y: y };
					}
				}
				if (compareSeqs(oppsCurrSeqs, oppsMaxSeqs) > 0) {
					oppsMaxSeqs = oppsCurrSeqs;
					if (oppsMaxSeqs[0].len >= myMaxSeqs[0].len) {
						targetPosition = { x: x, y: y };
					}
				}
				// if I lead
				if (myMaxSeqs[0].len > oppsMaxSeqs[0].len) {

					// If I can build the most valuable seqs on current tile AND
					// I have an opportunity to block more precious opponent's sequences than
					// on some previous position, then do it.
					if (compareSeqs(myCurrSeqs, myMaxSeqs) == 0 &&
						compareSeqs(oppsCurrSeqs, this.getPlayersSequences(targetPosition.x
																		, targetPosition.y
																		, other(computersSymbol)
																		, other(computersSymbol))) > 0) {
						targetPosition = { x : x, y : y };
					}

				// if I don't lead (i. e. opp's best seq > mine)
				} else {
					
					// If I can block the opponent's most valuable seqs on current tile AND
					// I have an opportunity to build more precious sequences than
					// on some previous position, then do it.
					if (compareSeqs(oppsCurrSeqs, oppsMaxSeqs) == 0 &&
						compareSeqs(myCurrSeqs, this.getPlayersSequences(targetPosition.x
																		, targetPosition.y
																		, computersSymbol
																		, other(computersSymbol))) > 0) {
						targetPosition = { x : x, y : y };
					}
				}
			}
		}
		return targetPosition;
	}

	getPlayersSequences(x, y, playerSymbol, oppSymbol) {
		const MAX_TOKENS = MAX_SEQUENCE_LENGTH - 1;
		let tokenCount = 0;
		let oppsDirTokenCount = 0;

		let seq = null;
		let oppDirSeq = null;

		let seqs = [];

		const dirs = ['W', 'NW', 'N', 'NE'];
		for (let dir in dirs) {
			tokenCount = MAX_TOKENS;
			oppsDirTokenCount = MAX_TOKENS;
			[seq, tokenCount] = this.parseDirection(x, y, playerSymbol, dirs[dir], tokenCount);
			[oppDirSeq, oppsDirTokenCount] = this.parseDirection(x, y, playerSymbol, opposite(dirs[dir])
											, oppsDirTokenCount);
			if (tokenCount + oppsDirTokenCount >= MAX_TOKENS) {
				if (seq.len > 0 && oppDirSeq.len > 0 && playerSymbol == oppSymbol) {
					seq.hasHoles = true;
				}
				if (playerSymbol != oppSymbol) {
					++seq.len;
				}
				if ((seq.len == 0 && oppDirSeq.len == 0)
				|| (tokenCount + oppsDirTokenCount > MAX_TOKENS && seq.blocked && oppDirSeq.blocked)) {
					continue;
				}

				seq.add(oppDirSeq);
				this.pushSequence(seqs, seq);
			} else {
				this.addOppDirSeq(seq, x, y, playerSymbol, oppSymbol, opposite(dirs[dir]), tokenCount);
				this.addOppDirSeq(oppDirSeq, x, y, playerSymbol, oppSymbol, opposite(dirs[dir]), oppsDirTokenCount);
				if (playerSymbol != oppSymbol) {
					++seq.len;
					++oppDirSeq.len;
				}

				this.pushSequence(seqs, seq);
				this.pushSequence(seqs, oppDirSeq);
			}
		}
		return seqs.length != 0 ? seqs : [new Sequence(0, false, false)];
	}

	pushSequence(seqList, seqToPush) {
		if (seqToPush.len == 1 && seqList.length > 0 && seqList[seqList.length - 1].len == 1) {
			seqList[seqList.length - 1] = new Sequence(1, false, false);
		} else {
			seqList.push(seqToPush);
			seqList.sort((a, b) => {
				return -a.compareTo(b);
			});
		}
	}

	addOppDirSeq(seq, x, y, playerSymbol, oppSymbol, dir, tokenCount) {
		if (tokenCount <= 0) {
			return;
		}
		let otherSide = this.parseDirection(x, y, playerSymbol, dir, tokenCount)[0];
		if (otherSide.len > 0) {
			if (playerSymbol == oppSymbol) {
				otherSide.hasHoles = true;
			}
			seq.add(otherSide);
		}
	}

	parseDirection(x, y, playerSymbol, direction, tokenCount) {
		let seq = new Sequence(0, false, false);
		let prevTile = playerSymbol;
		let currTile = null;
		let currPosition = { x: x, y: y };
		const dirVector = directions[direction];
		const SEQ_MAX_LEN = tokenCount;
		for (let i = 0; i < SEQ_MAX_LEN; ++i) {
			currPosition.x += dirVector.x;
			currPosition.y += dirVector.y;
			currTile = this.gameboard.at(currPosition.x, currPosition.y);

			if (currTile == undefined) {
				--tokenCount;
				if (prevTile == undefined) {
					tokenCount += 2;
					return [seq, tokenCount];
				}
			} else if (currTile == other(playerSymbol)) {
				seq.blocked = true;
				return [seq, tokenCount];
			} else {
				if (prevTile == undefined) {
					seq.hasHoles = true;
				}
				++seq.len;
				--tokenCount;
			}
			prevTile = currTile;
		}
		if (prevTile == undefined) {
			++tokenCount;
		} else if (prevTile == playerSymbol) {
			currPosition.x += dirVector.x;
			currPosition.y += dirVector.y;
			if (this.gameboard.at(currPosition.x, currPosition.y) == other(playerSymbol)) {
				seq.blocked = true;
			}
		}
		return [seq, tokenCount];
	}
}

export { AI };