
module.exports = class Row {
  constructor(cells = []) {
    this.cells_ = cells.slice();
  }

  get values() {
    return this.cells_.slice();
  }

  addElement(element) {
    this.cells_.push(element);
  }
}
