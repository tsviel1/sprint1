
function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push([])
        }
        mat.push(row)
    }
    return mat
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

//min- in, max-out
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
function startTimer() {
    gStartTime = Date.now()
    gIntervalID = setInterval(updateTime, 1000)
}
 function updateTime () {
     gGame.secsPassed++
     if (gGame.secsPassed > 59) {
         gGame.secsPassed = 0
         gGame.minsPassed++
     }
     var secs = gGame.secsPassed
     var mins = gGame.minsPassed
     if (secs < 10) secs = '0' + secs
     if (mins < 10) mins = '0' + mins
     var elSpanSeconds = document.querySelector('.timer span.seconds')
     elSpanSeconds.innerText = secs
     var elSpanMinutes = document.querySelector('.timer span.minutes')
     elSpanMinutes.innerText = mins
 }