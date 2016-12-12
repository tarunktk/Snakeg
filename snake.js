//Constants
var cols = 26;
var rows = 26;
//things
var EMPTY = 0;
var snake = 1;
var fruits = 1;
//Directions
var left = 0;
var up = 1;
var right = 2;
var down = 3;
//keyCodes
var key_left = 37;
var key_up = 38;
var key_right = 39;
var key_down = 40;
var grid = {
    width: null,
    height: null,
    _grid: null,
    init: function(d, c, r) {
        this.width = c;
        this.height = r;
        this._grid = [];
        for (var x = 0; x < c; x++) {
            this._grid.push([]);
            for (var y = 0; y < r; y++) {
                this._grid[x].push(d)
            }
        }
    },
    set: function(val, x, y) {
        this._grid[x][y] = val;
    },
    get: function(x, y) {
        return this._grid[x][y];
    }
}
var snake = {
    direction: null,
    _queue: null,
    init: function(d, x, y) {
        this.direction = d;
        this._queue = [];
        this.insert(x, y)
    },
    insert: function(x, y) {
        this._queue.unshift({
            x: x,
            y: y
        });
        this.last = this._queue[0];
    },
    remove: function() {
        return this._queue.pop();
    }

}

function setfood() {
    var empty = [];
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (grid.get(x, y) === EMPTY) {
                empty.push({
                    x: x,
                    y: y
                });
            }
        }
    }
    var randpos = empty[Math.floor(Math.random() * empty.length)];
    grid.set(fruits, randpos.x, randpos.y);
}

//Game Objects
var canvas, ctx, keystates, frames,score;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = cols * 20;
    canvas.height = rows * 20;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    frames = 0;
    keystate = {};
    document.addEventListener("keydown", function(evt) {
        keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
        delete keystate[evt.keyCode];
    });
    init();
    loop();
}

function init() {
  score = 0;
    grid.init(EMPTY, cols, rows);
    var sp = {
        x: Math.floor(cols / 2),
        y: rows - 1
    };
    snake.init(up, sp.x, sp.y);
    grid.set(snake, sp.x, sp.y);
    setfood();
}

function loop() {
    update();
    draw();
    window.requestAnimationFrame(loop, canvas);
}

function update() {
    frames++;
    if (keystate[key_left] && snake.direction !== right)
        snake.direction = left;
    if (keystate[key_up] && snake.direction !== down) snake.direction = up;
    if (keystate[key_right] && snake.direction !== left) snake.direction = right;
    if (keystate[key_down] && snake.direction !== up) snake.direction = down;
    if (frames % 5 === 0) {
        var nx = snake.last.x;
        var ny = snake.last.y;
        switch (snake.direction) {
            case left:
                nx--;
                break;
            case up:
                ny--;
                break;
            case right:
                nx++;
                break;
            case down:
                ny++;
                break;
        }
        if (0 > nx || nx > grid.width - 1 ||
            0 > ny || ny > grid.height - 1 ||
            grid.get(nx, ny) === snake) {
            return init();
        }
        if (grid.get(nx, ny) === fruits) {
          score++;
            var tail = {
                x: nx,
                y: ny
            };
            setfood();
        } else {
            var tail = snake.remove();
            grid.set(EMPTY, tail.x, tail.y);
            tail.x = nx;
            tail.y = ny;
        }

        grid.set(snake, tail.x, tail.y);
        snake.insert(tail.x, tail.y);
    }
}

function draw() {
    var tw = canvas.width / grid.width;
    var th = canvas.height / grid.height;
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            switch (grid.get(x, y)) {
                case EMPTY:
                    ctx.fillStyle = "#558C89";
                    break;
                case snake:
                    ctx.fillStyle = "#D9853B";

                    break;
                case fruits:
                    ctx.fillStyle = "#ECECEA";
                    break;
            }
            ctx.fillRect(x * tw, y * th, tw, th);
        }
    }
ctx.fillStyle = "#000"
ctx.fillText("Score is :" + score, 3, canvas.height-10);
ctx.font = "20px georgia";

}
main();
