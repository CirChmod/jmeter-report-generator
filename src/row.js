
module.exports = class Row {
  constructor(cells, format) {
    this.cells_ = [];
    if (cells !== null) {
      cells.forEach(v => {
        this.cells_.push(v);
      });
    }
    this.format_ = Object.assign({}, format) || {};

  }

  get contents() {
    return this.cells_;
  }
}
