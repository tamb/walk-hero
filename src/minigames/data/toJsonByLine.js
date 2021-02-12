const fs = require("fs");
const path = require("path");

/**
 * To read a file with words split by line and make into json array
 *
 * words generated from this https://www.randomlists.com/nouns?qty=500&dup=false
 */

const read = () => {
  let array;
  fs.readFile(`${path.resolve(__dirname)}/words.txt`, function(err, data) {
    if (err) throw err;
    array = data.toString().split("\n");
    array = array.map((word, i) => {
      word = word.toUpperCase();
      if (i === 0) {
        return `{"words":["${word}"`;
      } else if (i === array.length - 1) {
        return `"${word}"]}`;
      } else {
        return `"${word}"`;
      }
    });
    fs.writeFile(`${path.resolve(__dirname)}/words.json`, array, err => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  });
};

read();
