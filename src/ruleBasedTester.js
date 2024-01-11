 import unidecode from "https://esm.sh/unidecode"

import nameCorpus from 'https://cdn.jsdelivr.net/gh/MarketingPip/name-classifier@master/src/corpus.json' assert { type: "json"};


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

    const maleRegex = new RegExp("\\b^(" + maleSuffixes.join("|") + ")(\\s*)\\b", "i");
    const femaleRegex = new RegExp("\\b^(" + femaleSuffixes.join("|") + ")(\\s*)\\b", "i");

  
    const suffixRegex = new RegExp(`^(${maleSuffixes.concat(femaleSuffixes).join('|')})(\\.|\\s*)`, 'i');
  

  // Remove any suffixes and check to make sure valid string.
  // Example of invalid: "Actress", Example of valid: "Actress Sharon"
const results = (wordString.replace(/[^a-zA-Z]/g, '').replace(suffixRegex, '').trim() !== "") && wordString.replace(/[^a-zA-Z]/g, '').replace(suffixRegex, '').trim();


    if(!results){
      return "INVALID"
    }
  
  
    if (maleRegex.test(wordString)) {
        return "Male";
    } else if (femaleRegex.test(wordString)) {
        return "Female";
    } else {
        return "Unknown";
    }
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



function genderChecker(input){
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
// console.log(input)
  
  

const isInCategories = isNameInList(input);

if(isInCategories){
 const titleCaseIsInCategories = isInCategories.charAt(0).toUpperCase() + isInCategories.slice(1);
 return setResults(name, titleCaseIsInCategories);
}

  
  
 result = findGenderByEndCharacters(input) 
  
  
return setResults(name, result)
}



console.log(genderChecker("Sir. Alexandra"))
////////
