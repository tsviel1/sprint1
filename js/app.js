'use strict'

var gBoard
var gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0
}

var gLevel = {
	SIZE: 4,
	MINES: 2
}

const MINE_IMG = '<img src="img/mine.png" />'
const FLAG_IMG = '<img src="img/flag.png" />'


function initGame() {
	gBoard = buildBoard()
	console.log('gBoard', gBoard);
	renderBoard(gBoard);
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(4, 4)
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Make all the board without mines
			var cell = { minesAroundCount: null, isShown: false, isMine: false, isMarked: false };
			cell.minesAroundCount = setMinesNegsCount(i, j, board)
			// Add created cell to The game board
			board[i][j] = cell;
		}
	}
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellID = getClassName({ i: i, j: j })
			var cellClass = 'cell'

			strHTML += `<td class="${cellClass}" id="${cellID}" onclick="cellClicked(${i}, ${j})">`;

			if (currCell.isShown) {
				if (currCell.isMine) {
					strHTML += MINE_IMG;
				} else {
					strHTML += `<img src="img/${currCell.minesAroundCount}.png" />`;
				}

			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
	console.log('strHTML', strHTML);
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function setMinesNegsCount(cellI, cellJ, mat) {
	var count = 0
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue;
		for (var j = cellJ - 1; j <= cellJ; j++) {
			if (i === cellI && j === cellJ) continue;
			if (j < 0 || j >= mat[i].length) continue;

			if (mat[i][j].isMine) count++
		}
	}
	return count
}

function cellClicked(cellI, cellJ) {
	if (!gGame.isOn) {
		for (var i = 0; i < gLevel.MINES; i++) {
			var location = getEmptyCell(cellI, cellJ)
			gBoard[location.i][location.j].isMine = true
		}
		for (var i = 0; i < gBoard.length; i++) {
			for (var j = 0; j < gBoard[0].length; j++) {
				if (gBoard[i][j].isMine) continue
				gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)
			}
		}
		renderBoard(gBoard)
		gGame.isOn = true
	}
	if (!gBoard[cellI][cellJ].isMine) {
		for (var i = cellI - 1; i <= cellI + 1; i++) {
			if (i < 0 || i >= gBoard.length) continue;
			for (var j = cellJ - 1; j <= cellJ; j++) {
				if (j < 0 || j >= gBoard[i].length) continue;
				gBoard[i][j].isShown = true
			}
		}
		//DOM
		renderBoard(gBoard)
	} else {
		gameOver()
	}
}

function gameOver() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var cell = gBoard[i][j]
			cell.isShown = true
		}
	}
	//DOM
	renderBoard(gBoard)
	gGame.isOn = false
}

function getEmptyCell(cellI, cellJ) {
	var emptyCells = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var cell = gBoard[i][j]
			if (cellI === i && cellJ === j) continue
			emptyCells.push({ i, j })
		}
	}
	console.log(emptyCells);
	var randIdx = getRandomInt(0, emptyCells.length)
	var cell = emptyCells[randIdx]
	return cell
}


