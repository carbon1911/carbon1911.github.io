function other(playerSymbol) {
	return playerSymbol == 'X' ? 'O' : 'X';
}

function changePlayer(current) {
	return {
		symbol: other(current.symbol),
		computersTurn: !current.computersTurn
	};
}

export { changePlayer, other };