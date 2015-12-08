/**
 * Created by flepret1 on 07/12/15.
 */

var size = 100;
var step = 10;
var boardSize = 5;
var boardDepth = 8;

var GUI = function (canvas) {

    // private attributes
    var c,
        ctx,
        width,
        height,
        tokens = [],
        board = [],
        tower = [];

    // private methods
    var convert = function (xx, yy) {
        return {x: Math.floor(xx / 101), y: Math.floor(yy / 101)};
    };

    var coordsToString = function (coords) {
        return String.fromCharCode(coords.x + 65) + String.fromCharCode(coords.y + 49);
    };

    var loadImages = function () {
        tokens[0] = null;
        tokens[1] = new Image();
        tokens[2] = new Image();
        tokens[1].src = 'blueToken.png';
        tokens[2].src = 'whiteToken.png';
    };

    var create3DBoard = function () {
        board = new Array(boardSize);

        for (var i = 0; i < boardSize; i++) {
            board[i] = new Array(boardSize);
            for (var j = 0; j < boardSize; j++) {
                board[i][j] = new Array(boardDepth);
            }
        }
    };

    var initBoard = function () {
        board = [
            [[1, 2, 1, 2], [1, 2, 1], [], [], []],
            [[], [], [], [], []],
            [[], [], [2, 2], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []]
        ];
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

    var drawTower = function (x, y) {
        for (var token in tower) {
            drawMovingTokens(x, y, token, tower[token]);
        }
    };

    var drawBoard = function () {
        var line, col, token;

        for (line = 0; line < boardSize; line++) {
            for (col = 0; col < boardSize; col++) {
                for (token = 0; token < board[line][col].length; token++) {
                    drawToken(line, col, token, board[line][col][token]);
                }
            }
        }
    };

    var redraw = function () {
        drawEmptyBoard();
        drawBoard();
    };

    var getClickedToken = function (pixelX, pixelY, coords) {
        var y = pixelY - (size * coords.y + coords.y);

        for (var token = 0; token < board[coords.x][coords.y].length; token++) {
            if (token == board[coords.x][coords.y].length - 1) {
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

    var createTower = function (coords, token) {
        for (var t = token; t < board[coords.x][coords.y].length; t++) {
            tower.push(board[coords.x][coords.y][t]);
        }
        return tower;
    };

    var destroyTower = function () {
        tower = [];
    };

    var updateBoard = function (x, y) {
        for (var token = 0; token < tower.length; token++) {
            board[x][y].pop();
        }
    };

    var resetBoard = function (x, y) {
        for (var token = 0; token < tower.length; token++) {
            board[x][y].push(tower[token]);
        }
    };

    // init events
    var onMouseDown = function (e) {
        var coords = convert(e.offsetX, e.offsetY),
            token = getClickedToken(e.offsetX, e.offsetY, coords);

        if (token !== null) {
            createTower(coords, token);
            updateBoard(coords.x, coords.y);
        }
    };

    var onMouseUp = function (e) {
        var coords = convert(e.offsetX, e.offsetY);
        console.log('play(' + coordsToString(coords) + ');');

        resetBoard(coords.x, coords.y);
        destroyTower();

        redraw();
    };

    var onMouseMove = function (e) {
        if (tower.length != 0) {
            redraw();
            drawTower(e.offsetX, e.offsetY);
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
        width = c.width;
        height = c.height;

        loadImages();

        initEventListener();
        initBoard();

        drawEmptyBoard();
        setTimeout(drawBoard, 50);
    };

    // public methods


    init(canvas);
};