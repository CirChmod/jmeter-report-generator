
module.exports = class Cell {

  constructor(content, format) {
    this.content_ = content || "";
    this.format_ = Object.assign({}, format) || {};
  }

}