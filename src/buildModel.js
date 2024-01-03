// index.js
import {
  femaleNames,
  femaleNicknames,
  maleNames,
  maleNicknames,
} from './index.js';

//import unorm from 'unorm';
 import unidecode from 'unidecode'

function normalizeString(inputString) {
  return unidecode(inputString)
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
  ]
};

function findTop10EndingLetters(words) {
  // Create an object to store the frequency of each ending letter
  const endingLetterFrequency = {};

  // Iterate through each word in the array
  words.forEach(word => {
    // Get the last letter of the word
    const lastLetter = word.slice(-2);

    // Update the frequency in the object
    endingLetterFrequency[lastLetter] = (endingLetterFrequency[lastLetter] || 0) + 1;
  });

  // Convert the object to an array of [letter, frequency] pairs
  const endingLetterArray = Object.entries(endingLetterFrequency);

  // Sort the array based on frequency in descending order
  endingLetterArray.sort((a, b) => b[1] - a[1]);

  // Slice the array to get the top 10 items
  const top10EndingLetters = endingLetterArray.slice(0, 15);

  // Convert the result back to an object
  const result = Object.fromEntries(top10EndingLetters);

  return result;
}


async function writeToFileAgain() {
  try {
    const jsonString = JSON.stringify({female:findTop10EndingLetters(finalFemaleNames), male:findTop10EndingLetters(mergedMaleNames)});
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
