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
    origin: ''
};

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

    var initBoard = function () {
        board = [
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
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
                for (token = 0; token < board[line][col].length; token++) {
                    console.log('!');
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

    var removeTowerFromBoard = function (x, y) {
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
        var x = e.clientX - c.offsetLeft,
            y = e.clientY - c.offsetTop;

        var coords = convert(x, y),
            token = getClickedToken(x, y, coords);

        if (token !== null) {
            createTower(coords, token);
            removeTowerFromBoard(coords.x, coords.y);
        }

        Mouse.down = true;
        Mouse.originX = x;
        Mouse.originY = y;
        Mouse.origin = coordsToString(coords);
    };

    var onMouseUp = function (e) {
        var x = e.clientX - c.offsetLeft,
            y = e.clientY - c.offsetTop;

        var coords = convert(x, y);

        if (Mouse.hasMoved) {
            if (Mouse.origin !== coordsToString(coords)) {
                console.log('play(' + coordsToString(coords) + ');');
            }
        }
        else {
            console.log('play(' + coordsToString(coords) + ');');
        }

        resetBoard(coords.x, coords.y);
        destroyTower();

        redraw();

        Mouse.down = false;
        Mouse.hasMoved = false;
    };

    var onMouseMove = function (e) {
        if (Mouse.down) {
            if (!Mouse.hasMoved) {
                Mouse.hasMoved = true;
                console.log(
                    'select('
                    + coordsToString(convert(Mouse.originX, Mouse.originY))
                    + ',' + tower.length + ');'
                );
            }

            var x = e.clientX - c.offsetLeft,
                y = e.clientY - c.offsetTop;

            if (tower.length != 0) {
                redraw();
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
        initBoard();

        drawEmptyBoard();
    };

    // public methods

    init(canvas);
};