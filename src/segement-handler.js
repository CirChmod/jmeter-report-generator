const tableReslover = require('./table-tag-handler.js');
// const textResolver = require('./text-tag-handler.js');
// const chartResolver = require('./chart-tag-handler.js');


function handler(segement, options) {
  // TODO define the request json
  let request = {};
  // TODO resolve tag
  for (let tag in segement) {
    if (!HANDLER_MAPPING[tag]) return console.log("Unknow tag, ", tag);
    HANDLER_MAPPING[tag](segement[tag]);
  }
}

HANDLER_MAPPING = {
  table: tableReslover.handler,
  text: textResolver.handler,
  chartResolver: chartResolver.handler
}