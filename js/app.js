'use strict'


var gBoard
var gStartTime
var gIntervalID
var gIntervalOfSafe
var gIntervalHint
var gLives
var gSafeTries
var gHintTries
var gHintMode

var gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0,
	ended: false
}

var gLevel = {
	SIZE: 4,
	MINES: 2
}

const MINE_IMG = '<img src="img/mine.png" />'
const FLAG_IMG = '<img src="img/flag.png" />'


function initGame() {
	gGame.markedCount = 0
	gGame.shownCount = 0
	gBoard = buildBoard()
	renderBoard(gBoard);
	var elSimley = document.querySelector('.smiley')
	elSimley.innerText = '😊'
	gLives = 3
	gSafeTries = 3
	gHintTries = 3
	gHintMode = false
	updateLivesModal()
	updateSafeClick()
	updateHint()
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(gLevel.SIZE, gLevel.SIZE)
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Make all the board without mines
			var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, counted: false };
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

			var cellID = getIDbyLocation({ i: i, j: j })
			var cellClass = 'cell'

			strHTML += `<td oncontextmenu="return false" onmousedown="cellMarked(${i}, ${j}, this, event)" class="${cellClass}" id="${cellID}" onclick="cellClicked(${i}, ${j})">`;


			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Returns the class name for a specific cell
function getIDbyLocation(location) {
	var cellID = 'cell-' + location.i + '-' + location.j;
	return cellID;
}

function renderBoard2() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j]
			if (currCell.isShown && !currCell.isMine) {
				var cellID = getIDbyLocation({ i: i, j: j })
				var numOfNeighbors = currCell.minesAroundCount
				var strHTML = `<img src="img/${numOfNeighbors}.png" />`
				var elCell = document.getElementById(cellID)
				elCell.innerHTML = strHTML
			}
		}
	}
}



function setMinesNegsCount(cellI, cellJ, mat) {
	var count = 0
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue;
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (i === cellI && j === cellJ) continue;
			if (j < 0 || j >= mat[i].length) continue;
			if (mat[i][j].isMine) count++
		}
	}
	return count
}


function updateModelShown(cellI, cellJ) {
	var cell = gBoard[cellI][cellJ]
	if (cell.minesAroundCount === 0 && !cell.isMine) {
		for (var i = cellI - 1; i <= cellI + 1; i++) {
			if (i < 0 || i >= gBoard.length) continue;
			for (var j = cellJ - 1; j <= cellJ + 1; j++) {
				if (j < 0 || j >= gBoard[i].length) continue;
				var currCell = gBoard[i][j]
				if (currCell.isMine || currCell.isMarked || currCell.isShown) continue
				currCell.isShown = true
				if (currCell.minesAroundCount === 0 && !currCell.isMine) updateModelShown(i, j)
			}
		}
	} else {
		if (cell.isShown) return
		if (cell.minesAroundCount !== 0 && !cell.isMine) cell.isShown = true
	}
	updateGameShownCount()
}


function renderCells(cellI, cellJ) {
	var currCell = gBoard[cellI][cellJ]
	if (currCell.minesAroundCount === 0 && !currCell.isMine) {
		renderBoard2()
	} else {
		if (currCell.isMine) {
			var cellID = getIDbyLocation({ i: cellI, j: cellJ })
			var elCell = document.getElementById(cellID)
			elCell.innerHTML = MINE_IMG
		} else {
			var cellID = getIDbyLocation({ i: cellI, j: cellJ })
			var numOfNeighbors = currCell.minesAroundCount
			var strHTML = `<img src="img/${numOfNeighbors}.png" />`
			var elCell = document.getElementById(cellID)
			elCell.innerHTML = strHTML
		}
	}


}

function cellClicked(cellI, cellJ) {
	var cellClicked = gBoard[cellI][cellJ]
	if (cellClicked.isMarked) return
	if (cellClicked.isShown) return
	if (gGame.ended) return
	if (!gGame.isOn) {
		startTimer()
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
		gGame.isOn = true
		updateModelShown(cellI, cellJ)
		renderCells(cellI, cellJ)
	}
	if (!gHintMode) {
		if (!cellClicked.isMine) {
			updateModelShown(cellI, cellJ)
			renderCells(cellI, cellJ)
			checkIfWin()
		} else {
			cellClicked.isShown = true
			gLives--
			updateLivesModal()
			if (gLives === 0) gameOver()
			else {
				updateModelShown(cellI, cellJ)
				renderCells(cellI, cellJ)
				gGame.markedCount++
				checkIfWin()
			}
		}
	} else {
		showAllAround(cellI, cellJ)
		gHintMode = false
	}
}

function gameOver() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var cell = gBoard[i][j]
			if (cell.isMine) {
				cell.isShown = true
				renderCells(i, j)
			}
		}
	}
	gGame.isOn = false
	gGame.ended = true
	var elSimley = document.querySelector('.smiley')
	elSimley.innerText = '😭'
	clearInterval(gIntervalID)
}
function getEmptyCell(cellI, cellJ) {
	var emptyCells = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var cell = gBoard[i][j]
			if (cellI === i && cellJ === j) continue
			if (cell.isMine) continue
			emptyCells.push({ i, j })
		}
	}
	var randIdx = getRandomInt(0, emptyCells.length)
	var cell = emptyCells[randIdx]
	return cell
}

function cellMarked(cellI, cellJ, elCell, event) {
	if (gGame.ended) return
	if (event.which === 3) {
		var cell = gBoard[cellI][cellJ]
		if (cell.isShown) return
		if (cell.isMarked) {
			cell.isMarked = false
			elCell.innerHTML = ''
			if (cell.isMine) gGame.markedCount--
		} else {
			cell.isMarked = true
			elCell.innerHTML = FLAG_IMG
			if (cell.isMine) gGame.markedCount++
			checkIfWin()
		}
	}
}

function checkIfWin() {
	if ((gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) && (gGame.markedCount === gLevel.MINES)) {
		gGame.ended = true
		gGame.isOn = false
		var elSimley = document.querySelector('.smiley')
		elSimley.innerText = '😎'
		clearInterval(gIntervalID)
	}
}
function updateLivesModal() {
	var elSpan = document.querySelector('.lives span')
	elSpan.innerText = gLives
}