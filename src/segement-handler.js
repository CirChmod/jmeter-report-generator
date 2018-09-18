const tableReslover = require('./table-tag-handler.js');
// const textResolver = require('./text-tag-handler.js');
// const chartResolver = require('./chart-tag-handler.js');


module.exports = function handler({segement, options, callback}) {
  // TODO define the request json
  let segementData = [];
  // TODO resolve tag
  for (let tagOrAttr in segement) {
    if (!HANDLER_MAPPING[tagOrAttr]) return console.log("Unknow tag or attribute, ", tagOrAttr);
    HANDLER_MAPPING[tagOrAttr](segement[tagOrAttr], piece => {
      segementData.push(piece);
    });
  }
  callback(segementData);
}

HANDLER_MAPPING = {
  "table": tableReslover.handler,
  "text": textResolver.handler,
  "chartResolver": chartResolver.handler
}