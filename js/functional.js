'use strict'

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

function updateHint() {
    var elSpan = document.querySelector('.hint span')
    elSpan.innerText = gHintTries
}

function hint() {
    if (!gGame.isOn) return
    if (gHintTries === 0) return
    gHintMode = true
    gHintTries--
    updateHint()
}

// function showAllAround(cellI, cellJ) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue;
//             var currCell = gBoard[i][j]
//             if (!currCell.isShown) {
//                 if (currCell.isMine) {
//                     var cellID = getIDbyLocation({ i: i, j: i })
//                     var elCell = document.getElementById(cellID)
//                     elCell.innerHTML = MINE_IMG
//                     setTimeout(() => {
//                         elCell.innerHTML = ''
//                     }, 1000);
//                 } else {
//                     var cellID = getIDbyLocation({ i: i, j: j })
//                     var numOfNeighbors = currCell.minesAroundCount
//                     var strHTML = `<img src="img/${numOfNeighbors}.png" />`
//                     var elCell = document.getElementById(cellID)
//                     elCell.innerHTML = strHTML
//                     setTimeout(() => {
//                         elCell.innerHTML = ''
//                     }, 1000);
//                 }
//             }
//         }
//     }
// }

// nisaion aharon

function showAllAround(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var currCell = gBoard[i][j]
            if (!currCell.isShown) {
                gIntervalHint = setInterval(currCell.isShown = true, 1000)
                renderBoard2()
                setTimeout(() => {
                    clearInterval(gIntervalHint);
                }, 1000);
                setTimeout(() => {
                    renderBoard2
                }, 1500);
            }
        }
    }
}