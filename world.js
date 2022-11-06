function World(canvas_wrapper, total_cells) {
    this.total_cells = total_cells;
    this.old_state = new Array(this.total_cells).fill(0).map(() => new Array(this.total_cells).fill(0));
    this.current_state = new Array(this.total_cells).fill(0).map(() => new Array(this.total_cells).fill(0));
    this.canvas_wrapper = canvas_wrapper;
}

World.prototype.clear_world = function() {
    for (let i = 0; i < this.total_cells; i++) {
        for (let j = 0; j < this.total_cells; j++) {
            this.canvas_wrapper.set_cell(i, j, 0);
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
            this.canvas_wrapper.set_cell(c, r, this.current_state[r][c]);
        }
    }
};
