/**
 * Created by flepret1 on 07/12/15.
 */

var size = 100;
var step = 10;
var boardSize = 5;
var boardDepth = 8;

var Mouse = {
    down: false,
    hasMoved: false,
    originX: 0,
    originY: 0,
};

var GUI = function (e, canvas) {

    // private attributes
    var engine = e,
        c,
        ctx,
        width,
        height,
        tokens = [],
        board = [],
        tmpBoard = [],
        tower = [],
        scorePanels = document.getElementsByClassName('score'),
        playerScores = document.getElementsByClassName('playerScore'),
        lastAction = document.getElementById('details');

    // private methods
    var getNumberTokenAtIJ = function (i, j) {
        var cpt = 0, k;
        for (k = 0; k < 8; k++) {
            if (board[i][j][k] !== 0) {
                cpt++;
            }
        }
        return cpt;
    };

    var convert = function (xx, yy) {
        return {x: Math.floor(yy / 101), y: Math.floor(xx / 101)};
    };

    /*var coordsToString = function (coords) {
     return String.fromCharCode(coords.x + 65) + String.fromCharCode(coords.y + 49);
     };*/

    var loadImages = function () {
        tokens[0] = null;
        tokens[1] = new Image();
        tokens[2] = new Image();
        tokens[1].src = 'img/blueToken.png';
        tokens[2].src = 'img/whiteToken.png';
    };

    var create3DBoard = function () {
        board = new Array(boardSize);

        for (var i = 0; i < boardSize; i++) {
            board[i] = new Array(boardSize);
            for (var j = 0; j < boardSize; j++) {
                board[i][j] = new Array(boardDepth);
            }
        }

        tmpBoard = new Array(boardSize);

        for (var i = 0; i < boardSize; i++) {
            tmpBoard[i] = new Array(boardSize);
            for (var j = 0; j < boardSize; j++) {
                tmpBoard[i][j] = new Array(boardDepth);
            }
        }
    };

    var copy3DBoard = function () {
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                for (var k = 0; k < boardDepth; k++) {
                    tmpBoard[i][j][k] = board[i][j][k];
                }
            }
        }
    };

    var updateBoard = function () {
        board = engine.getBoard();
    };

    var updateScores = function () {
        var currentPlayer = engine.getCurrentPlayer();
        if (currentPlayer == 2) {
            scorePanels[0].style.opacity = 0.5;
            scorePanels[1].style.opacity = 1;
        } else {
            scorePanels[1].style.opacity = 0.5;
            scorePanels[0].style.opacity = 1;
        }
        playerScores[0].innerHTML = engine.getScorePerPlayer(1);
        playerScores[1].innerHTML = engine.getScorePerPlayer(2);
    };

    var updateLastAction = function () {
        lastAction.innerHTML = engine.getLastAction();
    };

    var updateInfos = function () {
        updateScores();
        updateLastAction();
    };

    var drawEmptyBoard = function () {
        var line, col;

        ctx.fillStyle = '#BBBBBB';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#EEEEEE';
        for (line = 0; line < 5; line++) {
            for (col = 0; col < 5; col++) {
                ctx.fillRect((line * size) + line, (col * size) + col, size, size);
            }
        }
    };

    var drawToken = function (x, y, token, player) {
        ctx.drawImage(tokens[player],
            x * size + x + step,
            y * size + y + (step * 5) - (token * step)
        );
    };

    var drawMovingTokens = function (x, y, token, player) {
        ctx.drawImage(tokens[player],
            x - 40,
            y - (token * step) - 30
        );
    };

    var drawCount = function (x, y) {
        if (tower[tower.length - 1] == 1) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = '#4183D7';
        }
        ctx.fillText(tower.length, x - 4, y - step * tower.length + 5);
    };

    var drawTower = function (x, y) {
        for (var token in tower) {
            drawMovingTokens(x, y, token, tower[token]);
        }
        drawCount(x, y);
    };

    var drawBoard = function () {
        var line, col, token;

        for (line = 0; line < boardSize; line++) {
            for (col = 0; col < boardSize; col++) {
                for (token = 0; token < getNumberTokenAtIJ(line, col); token++) {
                    drawToken(col, line, token, board[line][col][token]);
                }
            }
        }
    };

    var drawBoardWithHiddenTokens = function () {
        var line, col, token;

        for (line = 0; line < boardSize; line++) {
            for (col = 0; col < boardSize; col++) {
                for (token = 0; token < getNumberTokenAtIJ(line, col); token++) {
                    if (tmpBoard[line][col][token] != 0) {
                        drawToken(col, line, token, tmpBoard[line][col][token]);
                    }
                }
            }
        }
    };

    var redraw = function () {
        drawEmptyBoard();
        drawBoard();
    };

    var getClickedToken = function (pixelX, pixelY, coords) {
        var y = pixelY - (size * coords.x + coords.x),
            nbToken = getNumberTokenAtIJ(coords.x, coords.y);

        for (var token = 0; token < nbToken; token++) {
            if (token == nbToken - 1) {
                if (y <= 90 - token * step && y > 90 - (token + 1) * step - 30) {
                    return token;
                }
            }
            else {
                if (y <= 90 - token * step && y > 90 - (token + 1) * step) {
                    return token;
                }
            }
        }

        return null;
    };

    var hideTokens = function (coords) {
        var nbToken = getNumberTokenAtIJ(coords.x, coords.y);

        copy3DBoard();

        for (var token = nbToken - tower.length; token < nbToken; token++) {
            tmpBoard[coords.x][coords.y][token] = 0;
        }
    };

    var createTower = function (coords, token) {
        for (var t = token; t < getNumberTokenAtIJ(coords.x, coords.y); t++) {
            tower.push(board[coords.x][coords.y][t]);
        }
    };

    var destroyTower = function () {
        tower = [];
    };

    // init events
    var onMouseDown = function (e) {
        var x = e.clientX - $(c).offset().left,
            y = e.clientY - $(c).offset().top;

        var coords = convert(x, y);
        var token = getClickedToken(x, y, coords);

        if (token !== null) {
            createTower(coords, token);
        }

        Mouse.down = true;
        Mouse.originX = x;
        Mouse.originY = y;
    };

    var onMouseUp = function (e) {
        Mouse.down = false;
        Mouse.hasMoved = false;

        var x = e.clientX - $(c).offset().left,
            y = e.clientY - $(c).offset().top;

        var coords = convert(x, y);

        if (engine.play(coords.x, coords.y)) {
            updateInfos();
        }

        redraw();
        destroyTower();
    };

    var onMouseMove = function (e) {
        e.preventDefault();
        if (Mouse.down) {
            if (!Mouse.hasMoved) {
                Mouse.hasMoved = true;

                var coords = convert(Mouse.originX, Mouse.originY);
                engine.selectToken(coords.x, coords.y, tower.length);
                hideTokens(coords);
            }

            var x = e.clientX - $(c).offset().left,
                y = e.clientY - $(c).offset().top;

            if (tower.length != 0) {
                drawEmptyBoard();
                drawBoardWithHiddenTokens();
                drawTower(x, y);
            }
        }
    };

    var initEventListener = function () {
        c.onmousedown = onMouseDown;
        c.onmouseup = onMouseUp;
        c.onmousemove = onMouseMove;
    };

    // constructor
    var init = function (canvas) {
        c = canvas;
        ctx = c.getContext('2d');
        ctx.font = "bold 17px Arial";

        width = c.width;
        height = c.height;

        loadImages();

        initEventListener();
        create3DBoard();
        updateBoard();
        updateScores();

        drawEmptyBoard();
    };

    // public methods

    init(canvas);
};