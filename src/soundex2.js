// Minimum length of Soundex keys.
const minLength = 6;

// Soundex values belonging to characters.
// This map also includes vowels (with a value of 0) to easily distinguish
// between an unknown value or a vowel.
const map = {
  a: 0, e: 0, i: 0, o: 0, u: 0, y: 0,
  b: 1, f: 1, p: 1, v: 1,
  c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
  d: 3, t: 3,
  l: 4,
  m: 5, n: 5,
  r: 6
};

/**
 * Get the soundex key from a given value.
 *
 * @param {string} value
 *   Value to use.
 * @param {number} [maxLength=4]
 *   Create a code that is at most `maxLength` in size.
 *   The minimum is always 4 (padded on the right).
 * @returns {string}
 *   Soundex key for `value`.
 */
export function soundex(value, maxLength) {
  const lowercase = String(value).toLowerCase();
  const results = [];
  let previous;

  for (let index = 0; index < lowercase.length; index++) {
    const character = lowercase.charAt(index);
    let phonetics = map[character];

    if (index === 0) {
      // Initial letter
      results.push(character.toUpperCase());
    } else if (phonetics && phonetics !== previous) {
      // Phonetics value
      results.push(phonetics);
    } else if (phonetics === 0) {
      // Vowel
      phonetics = undefined;
    } else {
      // Unknown character (including H and W)
      phonetics = previous;
    }

    previous = phonetics;
  }

  return pad(results.join('')).slice(0, maxLength || minLength);
}

/**
 * Pad a given value with zero characters. The function only pads four characters.
 *
 * @param {string} value
 * @returns {string}
 */
function pad(value) {
  const length = minLength - value.length;
  return value + '0'.repeat(length > 0 ? length : 0);
}


function areSimilarSoundexCodes(code1, code2, threshold = 3) {
  let matchCount = 0;

  // Compare each character in the codes
  for (let i = 0; i < code1.length && i < code2.length; i++) {
    if (code1[i] === code2[i]) {
      matchCount++;
    }
  }

  // Return true if the number of matching characters is at least the threshold
  return matchCount >= threshold;
}


// Include the function definition here

function findClosestMatch(code, soundexLists) {
  let closestCategory = null;
  let closestDistance = Infinity;

  // Loop through each category of names
  for (const category in soundexLists) {
    // Loop through each Soundex code in the category
    for (const soundexCode of soundexLists[category]) {
      const distance = calculateSoundexDistance(code, soundexCode);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCategory = category;
      }
    }
  }

  return closestCategory;
}

/**
 * Calculate the distance between two Soundex codes.
 *
 * @param {string} code1
 *   First Soundex code.
 * @param {string} code2
 *   Second Soundex code.
 * @returns {number}
 *   Number of differing characters between the two codes.
 */
function calculateSoundexDistance(code1, code2) {
  let distance = 0;

  // Compare each character in the codes
  for (let i = 0; i < code1.length && i < code2.length; i++) {
    if (code1[i] !== code2[i]) {
      distance++;
    }
  }

  // Add the difference in length, if any
  distance += Math.abs(code1.length - code2.length);

  return distance;
}


// Example usage
const soundexLists = {
  Male: ['B620', 'C625', 'J630'],
  Female: ['J525', 'C200', 'S600'],
  Unisex: ['A150', 'E250', 'F300', 'T460']
};

const code = soundex('Cassandra'); // Returns 'J525'
console.log(code)

const closestCategory = findClosestMatch(code, soundexLists);
console.log("Closest category:", closestCategory);

