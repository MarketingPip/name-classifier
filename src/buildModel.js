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
