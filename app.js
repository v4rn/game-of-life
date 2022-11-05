let animation_event;
let start_btn;
let stop_btn;
let clear_btn;
let world;
let canvas;
let mouse_down_anchor;
const FRAME_SPEED = 500;

function World(canvas, total_cells) {
    this.total_cells = total_cells;
    this.old_state = new Array(this.total_cells).fill(0).map(() => new Array(this.total_cells).fill(0));
    this.current_state = new Array(this.total_cells).fill(0).map(() => new Array(this.total_cells).fill(0));
    this.canvas = canvas;
}

World.prototype.clear_world = function() {
    for (let i = 0; i < this.total_cells; i++) {
        for (let j = 0; j < this.total_cells; j++) {
            this.canvas.set_cell(i, j, 0);
            this.current_state[j][i] = 0;
        }
    }
};

World.prototype.count_live_cells = function(index) {
    let live_count = 0;
    neighbours = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ];
    for (let offset of neighbours) {
        [dx, dy] = offset;
        [r, c] = index;
        r = r + dx;
        c = c + dy;
        if (r >= 0 && r < this.total_cells && c >= 0 && c < this.total_cells && this.old_state[r][c]) {
            live_count++;
        }
    }
    return live_count;
};

World.prototype.incr_world = function() {

    this.old_state = dc(this.current_state);

    for (let r = 0; r < this.total_cells; r++) {
        for (let c = 0; c < this.total_cells; c++) {
            live_neighbours = this.count_live_cells([r, c]);
            this.current_state[r][c] = 0;
            if (this.old_state[r][c]) {
                this.current_state[r][c] = [2, 3].includes(live_neighbours) ? 1 : 0;
            } else {
                this.current_state[r][c] = live_neighbours == 3 ? 1 : 0;
            }
            this.canvas.set_cell(c, r, this.current_state[r][c]);
        }
    }
};

function Canvas(total_cells) {
    this.canvas = document.getElementById("canvas");
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.cell_dim = Math.floor(this.canvas.width / total_cells);
    this.ctx = this.canvas.getContext("2d");
}

Canvas.prototype.set_cell = function(i, j, value) {
    this.ctx.fillStyle = value ? "black" : "white";
    this.ctx.fillRect(i * this.cell_dim, j * this.cell_dim, this.cell_dim, this.cell_dim);
    this.ctx.strokeRect(i * this.cell_dim, j * this.cell_dim, this.cell_dim, this.cell_dim);
};


function addCanvasEventListeners() {
    canvas.canvas.addEventListener("mousedown", mouseDown);
    canvas.canvas.addEventListener("mouseup", mouseUp);
    canvas.canvas.addEventListener("mousemove", mouseMove);
};

function removeCanvasEventListeners() {
    canvas.canvas.removeEventListener("mousedown", mouseDown);
    canvas.canvas.removeEventListener("mousemove", mouseMove);
    canvas.canvas.removeEventListener("mouseup", mouseUp);
};

function mouseDown(event) {
    let cell_i = Math.floor((event.pageY - canvas.canvas.offsetTop) / canvas.cell_dim);
    let cell_j = Math.floor((event.pageX - canvas.canvas.offsetLeft) / canvas.cell_dim);
    mouse_down_anchor = [cell_i, cell_j];

    world.current_state[cell_i][cell_j] ^= 1;
    canvas.set_cell(cell_j, cell_i, world.current_state[cell_i][cell_j]);
}

function mouseUp(event) {
    mouse_down_anchor = null;
}

function mouseMove(event) {
    if(!mouse_down_anchor) return;
    let cell_i = Math.floor((event.pageY - canvas.canvas.offsetTop) / canvas.cell_dim);
    let cell_j = Math.floor((event.pageX - canvas.canvas.offsetLeft) / canvas.cell_dim);
    world.current_state[cell_i][cell_j] = 1;
    canvas.set_cell(cell_j, cell_i, 1);
};

function init_world() {
    const total_cells = 100;
    canvas = new Canvas(total_cells);
    world = new World(canvas, total_cells);

    // init btn vars
    start_btn = document.getElementById("start_button");
    stop_btn = document.getElementById("stop_button");
    clear_btn = document.getElementById("clear_button");

    // clear cells
    world.clear_world();

    // add events
    addCanvasEventListeners();
}

function start_world() {
    console.log("starting world!");
    start_btn.disabled = true;
    stop_btn.disabled = false;
    // animate
    animation_event = setInterval(() => world.incr_world(), FRAME_SPEED);
    // remove mouse events
    removeCanvasEventListeners();
}

function stop_world() {
    console.log("stoping world!");
    start_btn.disabled = false;
    stop_btn.disabled = true;
    // remove animation
    clearInterval(animation_event);
    // remove events
    addCanvasEventListeners();
}

function clear_world() {
    console.log("clearing world!");
    world.clear_world();
}
