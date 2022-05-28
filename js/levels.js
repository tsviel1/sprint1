'use strict'

function beginner() {
    gGame.isOn = false
    gGame.ended = false
    clearInterval(gIntervalID)
    gGame.secsPassed = 0
    gGame.minsPassed = 0
    var elSpanSeconds = document.querySelector('.timer span.seconds')
    elSpanSeconds.innerText = '00'
    var elSpanMinutes = document.querySelector('.timer span.minutes')
    elSpanMinutes.innerText = '00'
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    initGame()
}

function medium() {
    gGame.isOn = false
    gGame.ended = false
    clearInterval(gIntervalID)
    gGame.secsPassed = 0
    gGame.minsPassed = 0
    var elSpanSeconds = document.querySelector('.timer span.seconds')
    elSpanSeconds.innerText = '00'
    var elSpanMinutes = document.querySelector('.timer span.minutes')
    elSpanMinutes.innerText = '00'
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    initGame()
}

function expert() {
    gGame.isOn = false
    gGame.ended = false
    clearInterval(gIntervalID)
    gGame.secsPassed = 0
    gGame.minsPassed = 0
    var elSpanSeconds = document.querySelector('.timer span.seconds')
    elSpanSeconds.innerText = '00'
    var elSpanMinutes = document.querySelector('.timer span.minutes')
    elSpanMinutes.innerText = '00'
    gLevel.SIZE = 12;
    gLevel.MINES = 40;
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