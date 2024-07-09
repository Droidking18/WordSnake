// get json file

const wordList = require('./words_dictionary.json');

// Itterate through the object and get the keys

const keys = Object.keys(wordList);

// Get the length of the keys

const word_list_a = {};
const word_list_b = {};
const word_list_c = {};
const word_list_d = {};

// We will split the file into 4 parts
// We will then create a new file for each part

const length = keys.length;

for (let i = 0; i < length; i++) {
    const key = keys[i];
    if (i <= length / 4) {
        word_list_a[key] = wordList[key];
    }
    else if (i <= length / 2) {
        word_list_b[key] = wordList[key];
    }
    else if (i <= (length / 4) * 3) {
        word_list_c[key] = wordList[key];
    }
    else {
        word_list_d[key] = wordList[key];
    }
}

const fs = require('fs');

fs.writeFileSync('./word_list_a.json', JSON.stringify(word_list_a, null, 2));
fs.writeFileSync('./word_list_b.json', JSON.stringify(word_list_b, null, 2));
fs.writeFileSync('./word_list_c.json', JSON.stringify(word_list_c, null, 2));
fs.writeFileSync('./word_list_d.json', JSON.stringify(word_list_d, null, 2));

