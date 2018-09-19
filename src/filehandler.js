const fs = require('fs');

fs.readdirAsync = function(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, filenames) => {
      if (err) {
        reject(err);
      } else {
        resolve(filenames);
      }
    });
  });
}


fs.readFileAsync = function(path, callback) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
}

fs.readAllFiles = function(path, suffix, callback) {
  fs.readdirAsync(path).then(filenames => {
    console.log("Read files under " + path);
    filenames = filenames.filter(filename => isValidName(filename, suffix))
    return Promise.all(filenames.map(filename => fs.readFileAsync(path + filename)));
  }).then(files => {
    callback(files);
  });
}

function isValidName(filename, suffix) {
  return filename.split('.')[1] === suffix;
}