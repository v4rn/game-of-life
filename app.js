const WORLD_SIZE = 50;
const DIM = 400;
const CELL_SIZE = Math.floor(DIM / WORLD_SIZE);
const TOTAL_CELLS = WORLD_SIZE * CELL_SIZE;
const FRAME_SPEED = 500;

let previous_state = new Array(WORLD_SIZE).fill(0).map(() => new Array(WORLD_SIZE).fill(0));
let current_state = new Array(WORLD_SIZE).fill(0).map(() => new Array(WORLD_SIZE).fill(0));
let ctx;
let canvas;
let current_world_state;
let animation_event;

function dc(object){
  return JSON.parse(JSON.stringify(object));
}

function clear_cells() {
  let x,y;
  for (let i=0; i < WORLD_SIZE; i++) {
    for (let j=0; j < WORLD_SIZE; j++) {
      x = i * CELL_SIZE;
      y = j * CELL_SIZE;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

function init_world() {
  canvas = document.getElementById("canvas");
  canvas.width = DIM;
  canvas.height = DIM;
  ctx = canvas.getContext("2d");

  // clear cells
  clear_cells();

  // add events
  canvas.addEventListener("mousedown", selectCell);
}

function start_world() {
  console.log("starting world!");
  document.getElementById("start_button").disabled = true;
  document.getElementById("stop_button").disabled = false;
  animation_event = setInterval(incr_world, FRAME_SPEED);
}

function stop_world() {
  console.log("stoping world!");
  document.getElementById("start_button").disabled = false;
  document.getElementById("stop_button").disabled = true;
  clearInterval(animation_event);
}

function incr_world() {
  count_live_neighbours = (index) => {
    let live_count = 0;
    neighbours = [
      [-1,-1],  [0,-1],   [1,-1],
      [-1,0],             [1,0], 
      [-1,1],   [0,1],    [1,1],
    ];
    for (let offset of neighbours) {
      [dx, dy] = offset;
      [r, c] = index;
      r = r + dx;
      c = c + dy;
      if(r >= 0 && r < WORLD_SIZE && c >= 0 && c < WORLD_SIZE && previous_state[r][c]){
        live_count++;
      }
    }
    return live_count;
  }

  previous_state = dc(current_state);

  for(let r=0; r < WORLD_SIZE; r++) {
    for(let c=0; c < WORLD_SIZE; c++) {
      live_neighbours = count_live_neighbours([r, c]);
      current_state[r][c] = 0; 
      if (previous_state[r][c]) {
        current_state[r][c] = [2,3].includes(live_neighbours) ? 1 : 0;
      } else {
        current_state[r][c] = live_neighbours == 3 ? 1 : 0;
      }
      ctx.fillStyle = current_state[r][c] ? "black" : "white";
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function selectCell(event) {
  let cell_i = Math.floor((event.pageY - canvas.offsetTop) / CELL_SIZE);
  let cell_j = Math.floor((event.pageX - canvas.offsetLeft) / CELL_SIZE);

  current_state[cell_i][cell_j] ^= 1;

  ctx.fillStyle = current_state[cell_i][cell_j] ? "black" : "white";
  ctx.fillRect(CELL_SIZE * cell_j, CELL_SIZE * cell_i, CELL_SIZE, CELL_SIZE);
  ctx.strokeRect(CELL_SIZE * cell_j, CELL_SIZE * cell_i, CELL_SIZE, CELL_SIZE);

  return [cell_i, cell_j];
}
