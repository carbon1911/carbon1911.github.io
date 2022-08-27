const directions = {
					 W: { x: -1, y: 0 },
					NW: { x: -1, y: -1 },
					 N: { x:  0, y: -1 },
					NE: { x:  1, y: -1 },
					 E: { x:  1, y:  0 },
					SE: { x:  1, y:  1 },
					 S: { x:  0, y:  1 },
					SW: { x: -1, y:  1 }
					};

function opposite(direction) {
	switch (direction) {
		case 'W':
			return 'E';
		case 'NW':
			return 'SE';
		case 'N':
			return 'S';
		case 'NE':
			return 'SW';
		case 'E':
			return 'W';
		case 'SE':
			return 'NW';
		case 'S':
			return 'N';
		case 'SW':
			return 'NE';
		default:
			throw Error("Invalid direction.");
	}
}

export { directions, opposite };