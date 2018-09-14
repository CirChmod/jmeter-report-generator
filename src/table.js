const Row = require('./row.js');

module.exports = class Table {

  constructor(title, rows, format, isFirstRowAsTitle, isFirstColAsTitle) {
    this.title_ = title || "Table";
    this.row_ = [];
    if (rows) {
      rows.forEach(row => {
        this.row_.push(new Row(row));
      });
    }
    this.format_ = Object.assign({}, format) || {};
    this.isFirstRowAsTitle_ = isFirstRowAsTitle || false;
    this.isFirstColAsTitle_ = isFirstColAsTitle || false;
  }

  get rows() {
    return this.rows_;
  }

  get rowNum() {
    return this.rows_.length === 0 ? 0 : this.rows_[0]
  }

}