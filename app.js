// contants
const FRAME_SPEED = 500;
const TOTAL_CELLS = 200;
const CANVAS_SIZE = 800;

// global vars
let animation_event;
let start_btn;
let stop_btn;
let clear_btn;
let world;
let canvas_wrapper;
let mouse_down_anchor;

function addCanvasEventListeners() {
    canvas_wrapper.canvas.addEventListener("mousedown", mouseDown);
    canvas_wrapper.canvas.addEventListener("mouseup", mouseUp);
    canvas_wrapper.canvas.addEventListener("mousemove", mouseMove);
};

function removeCanvasEventListeners() {
    canvas_wrapper.canvas.removeEventListener("mousedown", mouseDown);
    canvas_wrapper.canvas.removeEventListener("mousemove", mouseMove);
    canvas_wrapper.canvas.removeEventListener("mouseup", mouseUp);
};

function mouseDown(event) {
    let cell_i = Math.floor((event.pageY - canvas_wrapper.canvas.offsetTop) / canvas_wrapper.cell_dim);
    let cell_j = Math.floor((event.pageX - canvas_wrapper.canvas.offsetLeft) / canvas_wrapper.cell_dim);
    mouse_down_anchor = [cell_i, cell_j];

    world.current_state[cell_i][cell_j] ^= 1;
    canvas_wrapper.set_cell(cell_j, cell_i, world.current_state[cell_i][cell_j]);
}

function mouseUp(event) {
    mouse_down_anchor = null;
}

function mouseMove(event) {
    if(!mouse_down_anchor) return;
    let cell_i = Math.floor((event.pageY - canvas_wrapper.canvas.offsetTop) / canvas_wrapper.cell_dim);
    let cell_j = Math.floor((event.pageX - canvas_wrapper.canvas.offsetLeft) / canvas_wrapper.cell_dim);

    world.current_state[cell_i][cell_j] = 1;
    canvas_wrapper.set_cell(cell_j, cell_i, 1);
};

function init_world() {
    canvas_wrapper = new CanvasWrapper(TOTAL_CELLS, CANVAS_SIZE);
    world = new World(canvas_wrapper, TOTAL_CELLS);

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
    clear_btn.disabled = true;
    // animate
    animation_event = setInterval(() => world.incr_world(), FRAME_SPEED);
    // remove mouse events
    removeCanvasEventListeners();
}

function stop_world() {
    console.log("stoping world!");
    start_btn.disabled = false;
    stop_btn.disabled = true;
    clear_btn.disabled = false;
    // remove animation
    clearInterval(animation_event);
    // remove events
    addCanvasEventListeners();
}

function clear_world() {
    console.log("clearing world!");
    world.clear_world();
}
