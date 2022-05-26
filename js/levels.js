'use strict'

function beginner() {
    gGame.isOn = false
    gGame.ended = false
    clearInterval(gIntervalID)
    gGame.secsPassed = 0
    var elSpan = document.querySelector('.timer span')
    elSpan.innerText = ''
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    initGame()
}

function medium() {
    gGame.isOn = false
    gGame.ended = false
    clearInterval(gIntervalID)
    gGame.secsPassed = 0
    var elSpan = document.querySelector('.timer span')
    elSpan.innerText = ''
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    initGame()
}

function expert() {
    gGame.isOn = false
    gGame.ended = false
    clearInterval(gIntervalID)
    gGame.secsPassed = 0
    var elSpan = document.querySelector('.timer span')
    elSpan.innerText = ''
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    initGame()
}

function resetGame() {
    if (gLevel.SIZE === 4) beginner()
    else if (gLevel.SIZE === 8) medium()
    else if (gLevel.SIZE === 12) expert()
}

function updateGameShownCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown && !currCell.isMarked && !currCell.counted && !currCell.isMine) {
                currCell.counted = true
                gGame.shownCount++
            }
        }
    }


}