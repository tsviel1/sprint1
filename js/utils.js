
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

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}
// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function addEl(value, time) {
    var cell = getEmptyCell()
    gBoard[cell.i][cell.j] = value
    renderCell(cell, value)
    setTimeout(function () {
        gBoard[cell.i][cell.j] = ''
        renderCell(cell, disCell)
    }, time)
}


function restart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    initGame()
}

//min- in, max-out
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

