const fh = require('./filehandler');
const fs = require('fs');
const Table = require('./table.js');

const tagHandlers = {
  "table": tableHandler,
  "text": textHandler,
  "chartResolver": chartHandler,
  "tc": tcHandler,
  "tr": trHandler,
  "aggregation": aggregationHandler
}

const attrAppenders = {
  "@_title": titleAppender,
  "@_range": rangeAppender
}

const aggregationResolvers = {
  "AVG": avgResolver,
  "SUM": sumResolver,
  "COUNT": countResolver
}

module.exports = function handler(xmlDefination, options, callback) {
  // TODO define the request json
  let segementData = {};
  let segement = xmlDefination["segement"];
  // TODO resolve tag
  for (let tagOrAttr in segement) {
    if (!tagHandlers[tagOrAttr]) return console.log("Unknown tag or attribute, ", tagOrAttr);
    tagHandlers[tagOrAttr](segement[tagOrAttr], data => {
      segementData["values"] = data;
    });
  }
  segementData["range"] = "A1";
  segementData["majorDimension"] = "ROWS";

  callback(segementData);
}

// callback with 2d array
function tableHandler(jsonPiece, callback) {
  let table = new Table({});

  table.title = jsonPiece["title"];
  table.range = jsonPiece["range"];
  let rowsLabels = [];
  let columnsLabels = [];
  let records = {};
  for (let tagOrAttr in jsonPiece) {
    if (tagHandlers[tagOrAttr]) {
      tagHandlers[tagOrAttr](jsonPiece[tagOrAttr], (rowOrCol) => {
        let majorDimension = rowOrCol["majorDimension"];
        table["majorDimension"] = majorDimension;
        if (majorDimension === "ROWS") {
          columnsLabels.push(rowOrCol["label"]);
        } else if (majorDimension === "COLUMNS") {
          rowsLabels.push(rowOrCol["label"]);
        }
        let result = rowOrCol["result"];
        for (let key in result) {
          if (records[key]) {
            records[key].push(result[key]);
          } else {
            records[key] = [result[key]];
          }
        }
      });
    } else if (attrAppenders[tagOrAttr]) {
      attrAppenders[tagOrAttr](jsonPiece[tagOrAttr], (key, attribute) => {
        table[key] = attribute;
      });
    } else {
      throw "Unknown tag -> " + tagOrAttr
    }
  }

  let verticalLabels = rowsLabels.length !== 0 ? columnsLabels : rowsLabels;
  for (let key in records) {
    verticalLabels.push(key);
    table.append(records[key]);
  }
  table.colLabels = columnsLabels;
  table.rowLabels = rowsLabels;
  callback(table.data);
}



function textHandler(jsonPiece, callback) {

}

function chartHandler(jsonPiece, callback) {

}

// callback with json object with label:value
function tcHandler(jsonPiece, callback) {
  if (jsonPiece instanceof Array) {
    jsonPiece.forEach(piece => {
      handleData(piece, "COLUMNS", callback);
    });
  } else {
    handleData(jsonPiece, "COLUMNS", callback);
  }
}

function trHandler(jsonPiece, callback) {
  if (jsonPiece instanceof Array) {
    jsonPiece.forEach(piece => {
      handleData(piece, "ROWS", callback);
    });
  } else {
    handleData(jsonPiece, "ROWS", callback);
  }
}

function handleData(jsonPiece, majorDimension, callback) {
  let content = fs.readFileSync(jsonPiece["@_dataSrc"]);
  let data = [];
  content.toString().split('\n').forEach(record => {
    // TODO ',' can be replace with variable
    if (!record) return;
    data.push(record.split(','));
  });
  for (let tag in jsonPiece) {
    if (tagHandlers[tag]) {
      tagHandlers[tag](jsonPiece[tag], data, (result) => {
        result["majorDimension"] = majorDimension;
        result["label"] = jsonPiece["@_label"];
        callback(result);
      });
    }
  }
}


function aggregationHandler(jsonPiece, data, callback) {
  if (data === []) return console.log("Data source is empty!");
  let colName = jsonPiece["@_colName"];
  let label = jsonPiece["@_groupBy"];
  let colNameIdx = 0;
  let labelIdx = 0;
  for (let idx in data[0]) {
    if (data[0][idx] === colName) {
      colNameIdx = idx;
    } else if (data[0][idx] === label) {
      labelIdx = idx;
    }
  }
  aggregationResolvers[jsonPiece["@_type"]](data.slice(1), colNameIdx, labelIdx, (result) => {
    callback({"result": result});
  });
}

function avgResolver(data, colIdx, labelIdx, callback) {
  let elementMap = new Map();
  let countMap = new Map();
  data.forEach(record => {
    if (record.length === 0) return;
    // TODO when record doesn't have corresponding field
    let curValue = elementMap.get(record[labelIdx]);
    elementMap.set(record[labelIdx], curValue ? curValue + Number(record[colIdx]) : Number(record[colIdx]));
    let curCount = countMap.get(record[labelIdx]);
    countMap.set(record[labelIdx], curCount ? ++curCount : 1);
  });
  let result = {};
  elementMap.forEach((value, key) => {
    let count = countMap.get(key);
    result[key] = Math.round(value / count);
  });
  callback(result);
}

function sumResolver(data, colIdx, labelIdx, callback) {

}

function countResolver(data, colIdx, labelIdx, callback) {

}

function titleAppender(title, callback) {
  callback("title", title);
}

function rangeAppender(range, callback) {
  callback("range", range);
}


/* ====================== Test ======================== */


// const xml2json = require('fast-xml-parser');
// (function test() {
//   fs.readFile('./resources/table-defination.xml', (err, content) => {
//     let json = xml2json.parse(content.toString(), options);
//     handler(json, "", () => {});
//   });
// })();
/* ==================================================== */