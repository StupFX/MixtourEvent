/**
 * Created by flepret1 on 07/12/15.
 */

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
        board = [];

    // private methods
    var convert = function (xx, yy) {
        return {x: Math.floor(xx / 100), y: Math.floor(yy / 100)};
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
            [
                [1, 2], [1], [], [], []
            ],
            [
                [], [], [], [], []
            ],
            [
                [], [], [], [], []
            ],
            [
                [], [], [], [], []
            ],
            [
                [], [], [], [], []
            ]
        ]
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

    // init events
    var onClick = function (e) {
        var coords = convert(e.offsetX, e.offsetY);
        console.log('Send to engine : ' + coordsToString(coords));
    };

    var onMouseMove = function (e) {
    };

    var initEventListener = function () {
        c.onclick = onClick;
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

        setTimeout(drawBoard, 5);
    };

    // public methods

    init(canvas);
};