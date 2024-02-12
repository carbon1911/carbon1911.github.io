function compareSeqs(a, b) {
	const smallerSize = Math.min(a.length, b.length);
	let comparisonRes = 0;
	for (let i = 0; i < smallerSize; ++i) {
		comparisonRes = a[i].compareTo(b[i]);
		if (comparisonRes != 0) {
			return comparisonRes;
		}
	}
	return a.length - b.length;
}

class Sequence {
	constructor(len, blocked, hasHoles) {
		if (len < 0) {
			throw Error("A sequence instantiated with negative length.");
		}
		this.len = len;
		this.blocked = blocked;
		this.hasHoles = hasHoles;
	}

	compareTo(other) {
		if (!other instanceof Sequence) {
			throw Error("Comparing a sequence to an invalid type.");
		}

		const lenDiff = this.len - other.len;
		return lenDiff == 0 ? this.attrsWeight() - other.attrsWeight() : lenDiff;
	}

	attrsWeight() {
		return (this.blocked ? -2 : 0) + (this.hasHoles ? -	1 : 0);
	}

	add(other) {
		if (!other instanceof Sequence) {
			throw Error("Adding an invalid type to the sequence.");
		}

		this.len += other.len;
		this.blocked |= other.blocked;
		this.hasHoles |= other.hasHoles;
	}
}

export { Sequence, compareSeqs };