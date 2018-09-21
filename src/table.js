const Row = require('./row.js');

module.exports = class Table {

  constructor( {title = "Unknown", range = "", records = [], rowsLabels = [], columnsLabels = [], majorDimension = "ROWS"} ) {
    this.title_ = title;
    this.range_ = range;
    this.rowLabels_ = rowsLabels.slice();
    this.colLabels_ = columnsLabels.slice();
    this.records_ = [];
    records.forEach(record => {
      this.records_.push(record.slice());
    }, this);
    this.majorDimension_ = majorDimension;
  }

  set majorDimension(md) {
    this.majorDimension_ = md;
  }

  get majorDimension() {
    return this.majorDimension_;
  }

  set title(t) {
    this.title_ = t;
  }

  get title() {
    return this.title_;
  }

  get data() {
    let data = [];
    data.push([this.title_]);
    let rowLabels = this.rowLabels_.slice();
    rowLabels.unshift("");
    data.push(rowLabels);
    let rowLength = this.rowLabels_.length;
    let colLength = this.colLabels_.length;
    // TODO refactor
    if (this.majorDimension_ === "ROWS") {
      for (let i = 0; i < colLength; i++) {
        let tmp = [];
        for (let j = 0; j < rowLength; j++) {
          tmp.push(this.records_[j][i]);
        }
        tmp.unshift(this.colLabels_[i]);
        data.push(tmp);
      }
    } else if (this.majorDimension_ === "COLUMNS") {
      for (let i = 0; i < colLength; i++) {
        let tmp = [];
        for (let j = 0; j < rowLength; j++) {
          tmp.push(this.records_[i][j]);
        }
        tmp.unshift(this.colLabels_[i]);
        data.push(tmp);
      }
    }
    return data;
  }



  get rowLabels() {
    return this.rowLabels_;
  }

  get colLabels() {
    return this.colLabels_;
  }

  set rowLabels(rl) {
    this.rowLabels_ = rl.slice();
  }

  set colLabels(cl) {
    this.colLabels_ = cl.slice();
  }

  append(record) {
    this.records_.push(record.slice());
  }
}