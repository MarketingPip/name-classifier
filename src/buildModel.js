// index.js
import {
  femaleNames,
  femaleNicknames,
  maleNames,
  maleNicknames,
} from './index.js';

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
const maleSplitObjects = [];
const femaleSplitObjects = [];

// Assuming mergedMaleNames and finalFemaleNames are arrays containing male and female names respectively.

const maleIntent = "male";
const femaleIntent = "female";

//const maleNames = mergedMaleNames.map(name => name.toLowerCase());
//const femaleNames = finalFemaleNames.map(name => name.toLowerCase());

// Function to split an array into chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Split maleNames into chunks of 1000
const maleChunks = chunkArray(maleNames, 1000);
for (let i = 0; i < maleChunks.length; i++) {
  const splitObject = {
    "intent": `${maleIntent}.${i + 1}`,
    "utterances": maleChunks[i],
    "answers": ["male"]
  };
  maleSplitObjects.push(splitObject);
}

// Split femaleNames into chunks of 1000
const femaleChunks = chunkArray(femaleNames, 1000);
for (let i = 0; i < femaleChunks.length; i++) {
  const splitObject = {
    "intent": `${femaleIntent}.${i + 1}`,
    "utterances": femaleChunks[i],
    "answers": ["female"]
  };
  femaleSplitObjects.push(splitObject);
}

const corpus = {
  "name": "Corpus",
  "locale": "en-US",
  "data": [
    ...maleSplitObjects,
    ...femaleSplitObjects
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
