function findCommonSuffixes(words) {
  // Create an object to store the frequency of each suffix
  const suffixFrequency = {};

  // Helper function to get all suffixes of a word
  function getSuffixes(word) {
    const suffixes = [];
    for (let i = 1; i <= word.length; i++) {
      suffixes.push(word.slice(-i));
    }
    return suffixes;
  }

  // Iterate through each word in the array
  words.forEach(word => {
    // Get all suffixes of the current word
    const suffixes = getSuffixes(word);

    // Update the frequency of each suffix in the object
    suffixes.forEach(suffix => {
      suffixFrequency[suffix] = (suffixFrequency[suffix] || 0) + 1;
    });
  });

  // Convert the object to an array of {suffix, frequency} pairs
  const suffixArray = Object.entries(suffixFrequency).map(([suffix, frequency]) => ({ suffix, frequency }));

  // Sort the array by frequency in descending order
  suffixArray.sort((a, b) => b.frequency - a.frequency);

  return suffixArray;
}

// Example usage:
const words = ['apple', 'pineapple', 'banana', 'grape'];
const commonSuffixes = findCommonSuffixes(words);

console.log(commonSuffixes);
