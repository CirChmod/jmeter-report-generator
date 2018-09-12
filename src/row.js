
module.exports = class Row {
  constructor(values) {
    this.values_ = [];
    if (values !== null) {
      values.forEach(v => {
        this.values_.push(v);
      });
    }
  }

  get values() {
    return this.values_;
  }
}
