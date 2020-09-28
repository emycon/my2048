var board = new Array();
var score = 0;
var hasConflicted = new Array();
var startx, starty, endx, endy;

$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    var container = $('#grid-container');
    container.css('width', gridContainerWidth - 2 * cellSpace);
    container.css('height', gridContainerWidth - 2 * cellSpace);
    container.css('padding', cellSpace);
    container.css('border-radius', 0.02 * gridContainerWidth);
    var cell = $('.grid-cell');
    cell.css('width', cellSideLength);
    cell.css('height', cellSideLength);
    cell.css('border-radius', 0.02 * cellSideLength);
}

function newgame() {
    // 初始化
    init();
    // 随机生成2个数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
}

function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }

    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

function generateOneNumber() {
    if (nospace(board)) return false;

    // 随机位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    // 随机数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 显示
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function (e) {
    switch (e.keyCode) {
        case 37: // left
            e.preventDefault();
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        case 38: // up
            e.preventDefault();
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        case 39: // right
            e.preventDefault();
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        case 40: // down
            e.preventDefault();
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart', function (e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
});

// just know
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
});

document.addEventListener('touchend', function (e) {
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) < 0.2 * documentWidth) return;

    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {
            // right
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
        } else {
            // left
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
        }
    } else {
        if (deltay > 0) {
            // down
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
        } else {
            // up
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
        }
    }
});

function isgameover() {
    // console.log(nospace(board), nomove(board));
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('game over!');
}

function moveLeft() {
    if (!canMoveLeft(board)) return false;
    // move left
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (
                        board[i][k] == board[i][j] &&
                        noBlockHorizontal(i, k, j, board) &&
                        !hasConflicted[i][k]
                    ) {
                        // move add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);

    return true;
}

function moveRight() {
    if (!canMoveRight(board)) return false;
    // move Right
    for (var i = 3; i >= 0; i--) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (
                        board[i][k] == board[i][j] &&
                        noBlockHorizontal(i, j, k, board) &&
                        !hasConflicted[i][k]
                    ) {
                        // move add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);

    return true;
}

function moveUp() {
    if (!canMoveUp(board)) return false;
    // move Up
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[j][i] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[k][i] == 0 && noBlockVertical(i, k, j, board)) {
                        // move
                        showMoveAnimation(j, i, k, i);
                        board[k][i] = board[j][i];
                        board[j][i] = 0;
                        continue;
                    } else if (board[k][i] == board[j][i] && noBlockVertical(i, k, j, board) && !hasConflicted[k][i]) {
                        // move add
                        showMoveAnimation(j, i, k, i);
                        board[k][i] += board[j][i];
                        board[j][i] = 0;
                        // add score
                        score += board[k][i];
                        updateScore(score);

                        hasConflicted[k][i] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);

    return true;
}

function moveDown() {
    // console.log(canMoveDown(board));
    if (!canMoveDown(board)) return false;
    // move Down
    for (var i = 3; i >= 0; i--) {
        for (var j = 2; j >= 0; j--) {
            if (board[j][i] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[k][i] == 0 && noBlockVertical(i, j, k, board)) {
                        // move
                        showMoveAnimation(j, i, k, i);
                        board[k][i] = board[j][i];
                        board[j][i] = 0;
                        continue;
                    } else if (board[k][i] == board[j][i] && noBlockVertical(i, j, k, board) && !hasConflicted[k][i]) {
                        // move add
                        showMoveAnimation(j, i, k, i);
                        board[k][i] += board[j][i];
                        board[j][i] = 0;
                        // add score
                        score += board[k][i];
                        updateScore(score);

                        hasConflicted[k][i] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);

    return true;
}
