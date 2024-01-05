// index.js
import {
  femaleNames,
  femaleNicknames,
  maleNames,
  maleNicknames,
  unisexNames
} from './index.js';

//import unorm from 'unorm';
 import unidecode from 'unidecode'

function normalizeString(inputString) {
  // Remove whitespace and non-letter characters using a regular expression
  inputString = unidecode(inputString);
  
  const normalizedString = inputString.replace(/[^a-zA-Z]/g, '');

  // Optionally, you can use unidecode if needed
 //  const finalString = normalizedString;

   const finalString = unidecode(normalizedString);

  return "gender: " + finalString;
}


import { promises as fsPromises } from 'fs';

// Merge arrays and remove duplicates
const mergeAndRemoveDuplicates = (array1, array2) => Array.from(new Set([...array1, ...array2]));

// Merge maleNames and maleNicknames, remove duplicates
const mergedMaleNames = mergeAndRemoveDuplicates(maleNames, maleNicknames);

// Merge femaleNames and femaleNicknames, remove duplicates
const mergedFemaleNames = mergeAndRemoveDuplicates(femaleNames, femaleNicknames);

// Remove items in final femaleNames found in final maleNames
const finalFemaleNames = mergedFemaleNames.filter(name => !mergedMaleNames.includes(name));

// Console log the results
console.log('Merged Male Names:', mergedMaleNames);
console.log('Merged Female Names:', mergedFemaleNames);
console.log('Final Female Names (after removing duplicates and filtering):', finalFemaleNames);

const corpus = {
  "name": "Corpus",
  "locale": "en-US",
  "data": [
    {
      "intent": "male",
      "utterances": [...mergedMaleNames.map(name => normalizeString(name.toLowerCase()))],
      "answers": [
        "male"
      ]
    },
    {
      "intent": "female",
      "utterances": [...finalFemaleNames.map(name => normalizeString(name.toLowerCase()))],
      "answers": [
        "female"
      ]
    },    
    {
      "intent": "unisex",
      "utterances": [...unisexNames.map(name => normalizeString(name.toLowerCase()))],
      "answers": [
        "unisex"
      ]
    }    
  ]
};

function findTop10EndingLetters(words) {
  // Create an object to store the frequency of each ending letter
  const endingLetterFrequency = {};

  // Iterate through each word in the array
  words.forEach(word => {
    // Ignore words with less than 2 letters
    if (word.length >= 2) {
      // Get the last two letters of the word
      const lastLetters = word.slice(-2);

      // Update the frequency in the object
      endingLetterFrequency[lastLetters] = (endingLetterFrequency[lastLetters] || 0) + 1;
    }
  });

  // Convert the object to an array of [letter, frequency] pairs
  const endingLetterArray = Object.entries(endingLetterFrequency);

  // Sort the array based on frequency in descending order
  endingLetterArray.sort((a, b) => b[1] - a[1]);

  // Slice the array to get the top 10 items
  const top10EndingLetters = endingLetterArray.slice(0, 100)

  // Convert the result back to an object
  const result = Object.fromEntries(top10EndingLetters);

  return result;
}


function removeDuplicatesFromBoth(data) {
  const combinedKeys = Object.keys(data["female"]).concat(Object.keys(data["male"]));
  const seenKeys = {};

  combinedKeys.forEach((key) => {
    if (seenKeys[key]) {
      delete data["female"][key];
      delete data["male"][key];
    } else {
      seenKeys[key] = true;
    }
  });

  return data;
}

const result = removeDuplicatesFromBoth({female:findTop10EndingLetters([...finalFemaleNames.map(name => normalizeString(name.toLowerCase()))]), male:findTop10EndingLetters([...mergedMaleNames.map(name => normalizeString(name.toLowerCase()))])});


function transformData(data) {
  const transformedData = {
    "female": [],
    "male": [],
    "top_chars": {}
  };

  for (const gender in data) {
    if (data.hasOwnProperty(gender)) {
      const keys = Object.keys(data[gender]);

      // Extract key names into arrays
      transformedData[gender] = keys;

      // Use the first item as the top item for the "top_chars" key (already have been sorted)
      transformedData["top_chars"][gender] = keys[0];
    }
  }

  return transformedData;
}


const transformedResult = transformData(result);

async function writeToFileAgain() {
  try {

    
    const jsonString = JSON.stringify(transformedResult);
    await fsPromises.writeFile('./src/topletters_corpus.json', jsonString);
    console.log('Data has been written to corpus.json');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

async function writeToFile() {
  try {
    const jsonString = JSON.stringify(corpus);
    await fsPromises.writeFile('./src/corpus.json', jsonString);
    console.log('Data has been written to corpus.json');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

writeToFile();
writeToFileAgain()


let needsClassifier = true
let Classifier = null;
if (needsClassifier) {
Classifier = class {
    constructor() {
        this.dict = {};
        this.categories = {};
        this.wordList = [];
        this.categoryList = []
    }
    static validate(token) {
        return /\w+/.test(token)
    }
    increment(token, category) {
        this.categories[category].tokenCount += 1;
        let word = this.dict[token];
        if (word === undefined) {
            this.dict[token] = {
                word: token,
                [category]: {
                    count: 1
                }
            };
            this
                .wordList
                .push(token)
        } else if (word[category] === undefined) {
            word[category] = {
                count: 1
            }
        } else {
            word[category].count += 1
        }
    }
    train(data, category) {
        if (this.categories[category] === undefined) {
            this.categories[category] = {
                docCount: 1,
                tokenCount: 0
            };
            this
                .categoryList
                .push(category)
        } else {
            this.categories[category].docCount += 1
        }
        let tokens = data.split(/\W+/);
        tokens.forEach(token => {
            token = token.toLowerCase();
            if (Classifier.validate(token)) {
                this.increment(token, category)
            }
        })
    }
    trainlist(datalist, category) {
        let i = 0;
        if (this.categories[category] === undefined) {
            this.categories[category] = {
                docCount: 1,
                tokenCount: 0
            };
            this
                .categoryList
                .push(category)
        } else {
            this.categories[category].docCount += 1
        }
        for (i=0; i<datalist.length; i++) {
            let data = datalist[i]
            let tokens = data.split(/\W+/);
            tokens.forEach(token => {
                token = token.toLowerCase();
                if (Classifier.validate(token)) {
                    this.increment(token, category)
                }
            })
        }
    }
    probabilities() {
        this
            .wordList
            .forEach(key => {
                let word = this.dict[key];
                this
                    .categoryList
                    .forEach(category => {
                        if (word[category] === undefined) {
                            word[category] = {
                                count: 0
                            }
                        }
                        let wordCat = word[category];
                        let cat = this.categories[category];
                        let freq = wordCat.count / cat.docCount;
                        wordCat.freq = freq
                    })
            });
        this
            .wordList
            .forEach(key => {
                let word = this.dict[key];
                this
                    .categoryList
                    .forEach(category => {
                        let sum = this
                            .categoryList
                            .reduce((p, cat) => {
                                let freq = word[cat].freq;
                                if (freq) {
                                    return p + freq
                                }
                                return p
                            }, 0);
                        let wordCat = word[category];
                        let prob = wordCat.freq / sum;
                        wordCat.prob = Math.max(0.01, Math.min(0.99, prob))
                    })
            })
    }
    guess(data) {
        let tokens = data.split(/\W+/);
        let words = [];
        tokens.forEach(token => {
            token = token.toLowerCase();
            if (Classifier.validate(token)) {
                if (this.dict[token] !== undefined) {
                    let word = this.dict[token];
                    words.push(word)
                }
            } else {}
        });
        let sum = 0;
        let products = this
            .categoryList
            .reduce((product, category) => {
                product[category] = words.reduce((prob, word) => {
                    return prob * word[category].prob
                }, 1);
                sum += product[category];
                return product
            }, {});
        let results = {};
        this
            .categoryList
            .forEach(category => {
                results[category] = {
                    probability: products[category] / sum
                };
            });
        return results
    }
}
}

let classifier = new Classifier();

classifier.trainlist([...mergedMaleNames.map(name => normalizeString(name.toLowerCase()))], "male");
classifier.trainlist([...finalFemaleNames.map(name => normalizeString(name.toLowerCase()))], "female");
classifier.trainlist([...unisexNames.map(name => normalizeString(name.toLowerCase()))], "unisex");
classifier.probabilities();

let results = null;

results = classifier.guess("Bob");
console.log(results);

results = classifier.guess("Lorie");
console.log(results);

results = classifier.guess("Bobbi");
console.log(results);

results = classifier.guess("Hayley");
console.log(results);

results = classifier.guess("Ryan Joesph");
console.log(results);

results = classifier.guess("Bobby");
console.log(results);

results = classifier.guess("Hakizama");
console.log(results);

results = classifier.guess("Hakifred");
console.log(results);


results = classifier.guess("Taylor");
console.log(results);
