const tcResolver = require('table-column-handler.js');
const trResolver = require('table-row-handler.js');


module.exports = function handler({tableElement, callback}) {
  for(let key in tableElement) {
    if (!HANDLER_MAPPING[key]) return console.log("Unknow tag or attribute, ", key);

  }
}

HANDLER_MAPPING = {
  "@_range": rangeAppender,
  "@_majorDimension": majorDimensionAppender,
  "tr": trResolver.resolve,
  "tc": tcResolver.resolve
};