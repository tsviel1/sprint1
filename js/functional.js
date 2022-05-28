'use strict'

const LIGHT_BULB = '<img src="img/lightbulb.png" />'
const CLOSED_LIGHT_BULB = '<img src="img/closed-lightbulb.png" />'

// Safe Click

function safeClick() {
    if (gSafeTries === 0) return
    var cell = getSafeCell()
    if (!cell) return
    var cellID = getIDbyLocation(cell)
    var elCell = document.getElementById(cellID)
    elCell.style.backgroundColor = 'blue'
    setTimeout(() => {
        elCell.style.backgroundColor = 'gray'
    }, 3000);
    gSafeTries--
    updateSafeClick()
}

function getSafeCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine || cell.isShown || cell.isMarked) continue
            emptyCells.push({ i, j })
        }
    }
    var randIdx = getRandomInt(0, emptyCells.length)
    var cell = emptyCells[randIdx]
    if (emptyCells === []) return null
    return cell
}

function updateSafeClick() {
    var elSpan = document.querySelector('.safe-click span')
    elSpan.innerText = gSafeTries
}

// Hints

function bringLightBulbs() {
    var hintButtons = document.querySelectorAll('.hints button')
    hintButtons[0].innerHTML = CLOSED_LIGHT_BULB
    hintButtons[1].innerHTML = CLOSED_LIGHT_BULB
    hintButtons[2].innerHTML = CLOSED_LIGHT_BULB
}

function hint(elCell) {
    if (!gGame.isOn) return
    if (gHintTries === 0) return
    elCell.innerHTML = LIGHT_BULB
    gHintMode = true
    gHintTries--
}

function eliminateHint() {
    var hintButtons = document.querySelectorAll('.hints button')
    for (var i = 0; i < 3; i++) {
        if (hintButtons[i].innerHTML === LIGHT_BULB) hintButtons[i].style.display = 'none'
    }
}

function showAllAround(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMarked) {
                gAllAround.push({ i: i, j: j })
                currCell.isShown = true
            }
        }
    }
    renderCellsAround()
}

function clearAllAround() {
    for (var i = 0; i < gAllAround.length; i++) {
        var cellToHide = gAllAround[i]
        gBoard[cellToHide.i][cellToHide.j].isShown = false
    }
    unRenderCellsAround()
}

function renderCellsAround() {
    for (var i = 0; i < gAllAround.length; i++) {
        var currCellObject = gAllAround[i]
        var cellID = getIDbyLocation(currCellObject)
        var elCell = document.getElementById(cellID)
        var currCell = gBoard[currCellObject.i][currCellObject.j]
        if (!currCell.isMine) {
            var numOfNeighbors = currCell.minesAroundCount
            var strHTML = `<img src="img/${numOfNeighbors}.png" />`
        } else {
            var strHTML = MINE_IMG
        }
        elCell.innerHTML = strHTML
    }
}

function unRenderCellsAround() {
    for (var i = 0; i < gAllAround.length; i++) {
        var currCellObject = gAllAround[i]
        var cellID = getIDbyLocation(currCellObject)
        var elCell = document.getElementById(cellID)
        elCell.innerHTML = ''
    }
    gAllAround = []
}

function checkIfBestScore() {
    if (gGame.minsPassed > localStorage.bestScoreMins) return
    if (gGame.minsPassed === localStorage.bestScoreMins && gGame.secsPassed >= localStorage.bestScoreSecs) return
    localStorage.bestScoreMins = gGame.minsPassed
    localStorage.bestScoreSecs = gGame.secsPassed
    printBestScore()
}

function printBestScore() {
    var secs = localStorage.bestScoreSecs
    if (secs < 10) secs = '0' + secs
    var mins = localStorage.bestScoreMins
    if (mins < 10) mins = '0' + mins
    var str = `${mins}:${secs}`
    var elSpan = document.querySelector('.best-score span')
    elSpan.innerText = str
}

function undo() {
    if (gGame.ended) return
    var lastMove = gUndoMoves.pop()
    if (!lastMove) return
    for (var i = 0; i < lastMove.length; i++) {
        var currCellObject = lastMove[i]
        gBoard[currCellObject.i][currCellObject.j].isShown = false
        var cellID = getIDbyLocation(currCellObject)
        var elCell = document.getElementById(cellID)
        elCell.innerHTML = ''
    }
    updateGameShownCount()
}

