const Row = require('./row.js');

module.exports = class Table {

  constructor( {title = "Unknown", records = [], majorDimension = "ROWS"} ) {
    this.title_ = title;
    this.rows_ = [];
    this.cols_ = [];
    if (majorDimension === "ROWS") {
      this.rows_ = records.slice();
    } else if (majorDimension === "COLUMN") {
      this.cols_ = records.slice();
    }
  }

  get data() {
    let data = [];
    data.push[this.title_];
    if (majorDimension === "ROWS") {
      this.rows_.forEach(row => {
        data.push(row.values)
      });
    } else if (majorDimension === "COLUMN") {
      this.cols_.forEach(col => {
        data.push(col.values);
      });
    }
    return data;
  }

  appendRow(row) {
    this.rows_.push(new Row(row));
    let idx = 0;
    this.cols_.forEach(col => {
      col.addElement(row[idx++]);
    });
  }

  appendCol(col) {
    this.cols_.push(new Col(col));
    let idx = 0;
    this.rows_.forEach(row => {
      row.addElement(col[idx++]);
    })
  }

  get Row(index) {
    return this.rows_[index].values;
  }

  get Col(index) {
    return this.cols_[index].values;
  }

}