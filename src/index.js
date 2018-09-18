const fh = require('./filehandler');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const xmlParser = require('fast-xml-parser');
const segementHandler = require('./segement-handler.js')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = '../.credentials/token.json';

// Load client secrets from a local file.
fs.readFile('../.credentials/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

var options = {
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : true,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
    parseTrueNumberOnly: false
};


// function getTable(template, callback) {
//   let title = template["title"];
//   let firstRow = template["firstRowLabels"];
//   firstRow.unshift("");
//   let firstCol = template["firstColLabels"];
//   let emptyTable = [];
//   emptyTable.push([title]);
//   emptyTable.push(firstRow);
//   firstCol.forEach(col => {
//     emptyTable.push([col]);
//   });
//   return emptyTable;
// }

function loadSrcData(path, callback) {
  let data = [];
  fs.readAllFiles(path, 'csv', files => {
    files.forEach(file => {
      let fileData = file.toString().split('\n');
      let idx = fileData.length-1;
      while(fileData[idx] === "") fileData.pop(); 
      let tmp = fileData.map(row => row.split(','));
      let keys = tmp[0];
      tmp.forEach((row, idx) => {
        if (idx === 0) {
          return;
        }
        let obj = {};
        keys.forEach((key, idx) => {
          obj[key] = row[idx];
        });
        data.push(obj);
      });
    });
    callback(data);
  });
}

function groupBy(data, key, val, condition) {
  let tmpData = [];
  if (condition === "AVG") {
    let l = 180;
    let total = 0;
    let tableData = data.reduce((acc, cur) => {
      if (acc[cur[key]]) {
        acc[cur[key]] += Number(cur[val]);
      } else {
        acc[cur[key]] = Number(cur[val]);
      }
      return acc;
    }, {});
    for (let key in tableData) {
      tableData[key] = Math.round(tableData[key]/180);
    }
    console.log(tableData);
  }
}

function avg(key, opt_label) {

}

/**
 * 
 */
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  let request = {};
  request["spreadsheetId"] = "1ukefbciKahgaMj8bxYBhCyfdyjXff6Uh0O8smjxBypU";
  request["resource"] = {
    "valueInputOption": "USER_ENTERED",
    "data": []
  };
  let data = [];
  fs.readFile("./resources/table-defination.xml", (err, data) => {
    if (err) return console.log("Read xml fail for ", err);
    let sheetDefination = xmlParser.parse(data.toString(), options);
    segementHandler.handler(sheetDefination, segement => {
      data = segement.slice();
    });
    request["resource"]["data"] = data;
    sheets.spreadsheets.values.batchUpdate(request, (err, response) => {
      if (err) return console.log("Error happen when update sheet, ", err);
      console.log("Update successfully.", response);
    }); 
  });
}