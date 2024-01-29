// index.js
import {
  femaleNames,
  femaleNicknames,
  maleNames,
  maleNicknames,
  unisexNames
} from './index.js';


function findCommonSuffixes(words) {
  // Create an object to store the frequency of each suffix
  const suffixFrequency = {};

  // Helper function to get all valid suffixes of a word
  function getSuffixes(word) {
    const suffixes = [];
    for (let i = 1; i < word.length; i++) {
      suffixes.push(word.slice(-i));
    }
    return suffixes;
  }

  // Iterate through each word in the array
  words.forEach(word => {
    // Get all valid suffixes of the current word
    const suffixes = getSuffixes(word);

    // Update the frequency of each suffix in the object
    suffixes.forEach(suffix => {
      suffixFrequency[suffix] = (suffixFrequency[suffix] || 0) + 1;
    });
  });

  // Convert the object to an array of {suffix, frequency} pairs
  const suffixArray = Object.entries(suffixFrequency)
    .filter(([suffix, frequency]) => frequency > 1) // Exclude single occurrences
    .map(([suffix, frequency]) => ({ suffix, frequency }));

  // Sort the array by frequency in descending order
  suffixArray.sort((a, b) => b.frequency - a.frequency);

  return suffixArray;
}



// Example usage:
const words = [...maleNames];
const commonSuffixes = findCommonSuffixes(words);

console.log(commonSuffixes);


async function writeToFile() {
  try {
    const jsonString = JSON.stringify(commonSuffixes).trim()
    await fsPromises.writeFile('./src/commonMaleSuffixes.json', jsonString);
    console.log('Data has been written to corpus.json');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

writeToFile();
