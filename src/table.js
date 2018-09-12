const Row = require('./row.js');

module.exports = class Table {

  constructor(rows, cols, isFirstRowAsTitle) {
    this.rows_ = new Row(row);
    this.cols_ = col;
    this.isFirstRowAsTitle_ = isFirstRowAsTitle || false;
  }

  get rows() {
    return this.rows_;
  }

  get cols() {
    return this.cols_;
  }
}