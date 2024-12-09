 import unidecode from "https://esm.sh/unidecode"

import bayes from "https://esm.sh/bayes"
 
var classifier = bayes({
    tokenizer: function (text) { return text.split(' ') }
})
 

import nameCorpus from 'https://cdn.jsdelivr.net/gh/MarketingPip/name-classifier@latest/src/corpus.json' assert { type: "json"};


const exampleData = {
  "female": {"na": 2602, "ia": 1562, "ne": 1060, "ta": 987, "la": 959, "ra": 933, "ah": 860, "da": 770, "ka": 728, "ie": 501, "ja": 476, "sa": 433, "ha": 364, "ma": 344, "en": 339},
  "male": {"an": 1878, "on": 1227, "ng": 1151, "us": 1053, "io": 1014, "in": 1005, "er": 969, "ar": 786, "as": 742, "el": 641, "is": 627, "no": 617, "ur": 552, "en": 540, "ir": 484}
};

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

const result = removeDuplicatesFromBoth(exampleData);
//console.log(result);


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


const transformedResult = transformData(exampleData);



function findGenderByEndCharacters(name) {

  const data = transformedResult
//console.log(data)
  const lastTwoLetters = name.slice(-2);

  if (data.female.includes(lastTwoLetters)) {
    return "Female"
  } else if (data.male.includes(lastTwoLetters)) {
    return "Male"
  } else {
    return "Unknown"
  }
}

function checkGenderBySuffix(wordString) {
    const maleSuffixes = ["Mr.", "Mister", "Senior", "Jr.", "Junior", "King", "Pope", "Prince", "Sir", "Father", "Lord", "Bro.", "Fr.", "Uncle", "Grandpa", "Opa", "Emperor"];
    const femaleSuffixes = ["Mrs.", "Miss", "Queen", "Princess", "Madam", "Ms.", "Sister", "Madame", "Lady", "Sis.", "Duchess", "Countess", "Abbess", "Aunt", "Grandma", "Oma", "Mother", "Mademoiselle", "First Lady", "Actress"];

 // Split the string and remove periods
  const words = wordString.split(" ").map(word => word.replaceAll('.', '').toLowerCase());

  // Check if there are two words and the first word matches any suffix
  if (words.length === 2) {
    const [firstWord] = words;

    if (maleSuffixes.map(suffix => suffix.toLowerCase()).includes(firstWord)) {
      return "Male";
    } else if (femaleSuffixes.map(suffix => suffix.toLowerCase()).includes(firstWord)) {
      return "Female";
    }
  }

  return "Unknown";
}



// Array of short suffixes
const suffixes = [
    "Gov. Gen.",
  "CEO.",
  "Dr.",
  "Rev.",
  "Prof.",
  "Sgt.",
  "Esq.",
  "Hon.",
  "Pres.",
  "Gov.",
  "Cmdr.",
  "Maj.",
  "Sen.",
  "Rep.",
  'Sr.', // Senior
  'Jr.', // Junior
  'Brig.', // Brigadier
  'Engr.', // Engineer
  'Amb.', // Ambassador
  "Engr.",
  "Cpl.",
  "Pvt.",
  "Pte", // Canada Private
  "Const.",
  "Ind.",
  "Lt-Col.",
  "Lt-Cmdr.",
  "Flt Lt.",
  "Brgdr.",
  "Wng Cmdr.",
  "Group Capt.",
  "Maj-Gen.",
  "Air Cdre.",
  "Rear Admrl.",
  "Admrl.",
  "Lt. Gen.",
  "Maj. Gen.",
  "Brig. Gen.",
  "Lt. Col.",
  "Capt.",
  "Cdte",
  "1st Lt.",
  "2nd Lt.",
  "2Lt",
  "Lieut.",
  "Maj.-Gen.",
  "Lt.-Gen.",
  "Sub-Lieut.",
  "Cmdre",
   "Col.",
  "Lt", // Canada 1st LT
    "Gen.",
  
];

const militaryTitles = [
    'Envoy',
  'Ambassador',
  'Judge',
  'Mayor',
  'Governor',
  'Senator',
  "Coach",
  "Doctor",
  "Reverend",
  "Professor",
  "Captain",
  "Sergeant",
  "Esquire",
  "Honorable",
  "President",
  "General",
  "Colonel",
  "Commander",
  "Major",
  "Senator",
  "Representative",
  "Ambassador",
  "Engineer",
  "Corporal",
  "Private",
  "Constable",
  "Indian",
  "Lieutenant General",
  "Major General",
  "Brigadier General",
  "Colonel",
  "Lieutenant Colonel",
  "Major",
  "Captain",
  "First Lieutenant",
  "Second Lieutenant",
  // Canada Miltary Ranks Below
  "Officer Cadet",
  "Chief Warrant Officer",
  "Master Warrant Officer",
  "Warrant Officer",
  "Sergeant",
  "Sargent", // A common mispelling of sargent 
  "Master Corporal",
  "Corporal",
  "Private",
  "Admiral",
  "Vice-Admiral",
  "Rear-Admiral",
  "Cadet",
  "Commodore",
  "Commander",
  "Lieutenant-Commander",
  "Lieutenant",
  "Sub-Lieutenant",
  "Acting Sub-Lieutenant",
  "Naval Cadet",
  "Chief Petty Officer",
   'Chancellor',
  "Founder",
  'Dean',
  'Principal',
  'Chief',
  'Senator'
  
]


function suffixListCheck(inputString){
   const suffixesTests =   new RegExp("\\b^(" + suffixes.concat(militaryTitles).join("|") + ")(\\s*)\\b", "i");
  return suffixesTests.test(inputString) 
}


function processText(text){
 text = text.split(/\s+/)[0]
 return text
}

// Function to remove suffix from string
function removeSuffixFromString(inputString) {
  
  if(inputString.toLowerCase() === "dean"){
    return inputString
  }
  
  const suffixRegex = new RegExp(`^(${suffixes.concat(militaryTitles).join('|')})(\\.|\\s*)`, 'i');
  
  
  const results = inputString.replace(suffixRegex, '').trim();
  
  
  let input = inputString
  
 // console.log(results.split(/\s+/))
  // Check if the input string has two words separated by a dot (need a better solution for things like Gov. Gen.)
  if (results.split(/\s+/).length === 1 || input.split('.').length === 2 && input.split(/\s+/).length === 1) {

    return 'Unknown';
  } else {
    return results
  }
}





function RuleMatchFound(result){
  if(result != "Unknown" || result != "INVALID"){
  return true  // Gender was founder for suffix
} 
  
 return false 
}


function RemoveIllegalCharacters(text) {
    // Regular expression pattern to clean human names and allow certain characters Example: Sir. Isaac Newton, Professor Fons-Woth. 
    const pattern = /[A-Za-z.'-]+/g;

    // Find all matches in the input text
    const matches = text.match(pattern);

    // Join the matches back into a single string
    const result = matches ? matches.join(' ') : '';

    return result.trim();
}



function setResults(name = null, gender=null){
  const results = {name, gender}
  return results
}

function normalizeString(inputString) {
  // Remove whitespace and non-letter characters using a regular expression
  inputString = unidecode(inputString);
  
  const normalizedString = inputString.replace(/[^a-zA-Z]/g, '');

  // Optionally, you can use unidecode if needed
 //  const finalString = normalizedString;

   const finalString = unidecode(normalizedString);

  return finalString.toLowerCase();
}


function isNameInList(item) {
     const foundCategory = nameCorpus.data.find(entry =>
        entry.utterances.includes(item)
    );

    return foundCategory ? foundCategory.intent : null;
}



async function genderChecker(input){
  // Example usage

const name = input 
  
input = RemoveIllegalCharacters(input)
  
  
let result = checkGenderBySuffix(input);


  
if(RuleMatchFound(result) && result === "INVALID"){
  if(result === "INVALID"){
    result = "Unknown"
  }
 
  return setResults(name, result)
}
 // Suffix found such as Dr. (we can not determine) 
 if(suffixListCheck(input)){

input = removeSuffixFromString(input);
 
    // String only has 1 word. Example: Dr.Ruth (we can not determine this - maybe in future models / training data)
    if(input === "Unknown"){

      return setResults(name, input)
    }
   
 }

  // Preprocess text for classifer & end character rule check & exact match.
 input = processText(input) 
  
 input = normalizeString(input) 
console.log(input)
  
  

const isInCategories = isNameInList(input);

if(isInCategories){
 const titleCaseIsInCategories = isInCategories.charAt(0).toUpperCase() + isInCategories.slice(1);
 return setResults(name, titleCaseIsInCategories);
}

 
  
await Promise.all(nameCorpus.data[0].utterances.map(async (utterance) => await classifier.learn(utterance, 'Male')));
  
  
await Promise.all(nameCorpus.data[1].utterances.map(async (utterance) => await classifier.learn(utterance, 'Female')));  
  
await Promise.all(nameCorpus.data[2].utterances.map(async (utterance) => await classifier.learn(utterance, 'Unisex')));
  
  
 
  
  
 const bayesClassiferResults = await classifier.categorize(input)
 
 if(bayesClassiferResults){
   result = bayesClassiferResults
 }
 
 if(!bayesClassiferResults){ 
 result = findGenderByEndCharacters(input) 
 }
 
  
return setResults(name, result)
}



class Classifier {
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


console.log(await genderChecker("Sierra"))//
//
