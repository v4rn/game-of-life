function CanvasWrapper(total_cells, canvas_size) {
    this.canvas = document.getElementById("canvas");
    this.canvas.width = canvas_size;
    this.canvas.height = canvas_size;
    this.cell_dim = Math.floor(this.canvas.width / total_cells);
    this.ctx = this.canvas.getContext("2d");
}

CanvasWrapper.prototype.set_cell = function(i, j, value) {
    this.ctx.fillStyle = value ? "black" : "white";
    this.ctx.fillRect(i * this.cell_dim, j * this.cell_dim, this.cell_dim, this.cell_dim);
    this.ctx.strokeRect(i * this.cell_dim, j * this.cell_dim, this.cell_dim, this.cell_dim);
};

