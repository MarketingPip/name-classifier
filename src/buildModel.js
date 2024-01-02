// index.js
import {
  femaleNames,
  femaleNicknames,
  maleNames,
  maleNicknames,
} from './index.js';

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
