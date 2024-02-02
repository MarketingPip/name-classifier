// index.js
import {
  femaleNames,
  femaleNicknames,
  maleNames,
  maleNicknames,
  unisexNames
} from './index.js';

import { promises as fsPromises } from 'fs';



//import unorm from 'unorm';
 import unidecode from 'unidecode'

function normalizeString(inputString) {
  // Remove whitespace and non-letter characters using a regular expression
  inputString = unidecode(inputString);
  
  const normalizedString = inputString.replace(/[^a-zA-Z]/g, '');

  // Optionally, you can use unidecode if needed
 //  const finalString = normalizedString;

   const finalString = unidecode(normalizedString);

  return finalString;
}




function findCommonSuffixes(words) {
  // Create an object to store the frequency of each suffix
  const suffixFrequency = {};

  // Helper function to get all valid suffixes of a word
  function getSuffixes(word) {
    const suffixes = [];
    for (let i = 2; i <= word.length; i++) {
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
    .filter(([suffix, frequency]) => frequency > 1 && suffix.length > 1) // Exclude single occurrences and length 1 suffixes
    .map(([suffix, frequency]) => ({ suffix, frequency }));

  // Sort the array by frequency in descending order
  suffixArray.sort((a, b) => b.frequency - a.frequency);

  return suffixArray;
}




// Example usage:
const words = [...maleNames.map(name => normalizeString(name.toLowerCase()))]
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



class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `#title: Recent events
SELECT ?event ?eventLabel ?date (GROUP_CONCAT(DISTINCT ?englishInstanceOfLabel; SEPARATOR=", ") AS ?instanceLabels)
(GROUP_CONCAT(DISTINCT ?shortDescription; SEPARATOR=", ") AS ?descriptions)
(GROUP_CONCAT(DISTINCT ?alias; SEPARATOR=", ") AS ?aliases)
(GROUP_CONCAT(DISTINCT ?coordinates; SEPARATOR=", ") AS ?long_lat)
(GROUP_CONCAT(DISTINCT ?englishLocationLabel; SEPARATOR=", ") AS ?place) (GROUP_CONCAT(DISTINCT ?countryLabels; SEPARATOR=", ") AS ?countries) 
(GROUP_CONCAT(DISTINCT ?partOfLabels; SEPARATOR=", ") AS ?partOf) 
WITH {
  SELECT DISTINCT ?event ?date
  WHERE {
    # find events
    ?event wdt:P31/wdt:P279* wd:Q1190554.
    # with a point in time or start date
    OPTIONAL { ?event wdt:P585 ?date. }
    OPTIONAL { ?event wdt:P580 ?date. }
    # but at least one of those
    FILTER(BOUND(?date) && DATATYPE(?date) = xsd:dateTime).
    # not in the future, and not more than 31 days ago
    BIND(NOW() - ?date AS ?distance).
    FILTER(0 <= ?distance && ?distance < 31).
  }
  LIMIT 50
} AS %i
WHERE {
  INCLUDE %i

  # Get instance of, short description, and English alias
  OPTIONAL { ?event wdt:P31 ?instanceOf. 
             ?instanceOf rdfs:label ?englishInstanceOfLabel. FILTER(LANG(?englishInstanceOfLabel) = "en"). }
  OPTIONAL { ?event schema:description ?shortDescription. FILTER(LANG(?shortDescription) = "en"). }
  OPTIONAL { ?event skos:altLabel ?alias. FILTER(LANG(?alias) = "en"). }

  # Get location, country, latitude, and longitude information
  OPTIONAL { ?event wdt:P276 ?location.
             ?location rdfs:label ?englishLocationLabel. FILTER(LANG(?englishLocationLabel) = "en"). }
           

  OPTIONAL { ?event wdt:P625 ?coordinates. }
    OPTIONAL { ?event wdt:P361 ?partOf. 
               ?partOf rdfs:label ?partOfLabels. FILTER(LANG(?partOfLabels) = "en").}
  OPTIONAL { ?event wdt:P17 ?country. 
            ?country rdfs:label ?countryLabels. FILTER(LANG(?countryLabels) = "en").}


  # Exclude specific events by QIDs (Add QIDs you want to exclude)
  FILTER NOT EXISTS { ?event wdt:P31/wdt:P279* wd:Q123456789. }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?event ?eventLabel ?date ?countries ?latitude ?longitude`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );

async function getData(){
  try{
  let json = await queryDispatcher.query( sparqlQuery )
  let events = await getAllQIDsInfo(formatJSONData(json.results).allEvents())
    console.log(events)
  }catch(err){
    console.log(err.message)
  }
  }

getData()

function formatJSONData(data) {
  const formattedData = [];
//
  data.bindings.forEach(item => {
    const countryName = item.countries.value.split(', ')[0];
    const event =  {
  event: item.event.value.trim() || null,
  eventLabel: item.eventLabel.value.trim() || null,
  date: item.date.value.trim() || null,
  instanceLabels: item.instanceLabels.value.trim() ? item.instanceLabels.value.trim().split(', ') : null,
  descriptions: item.descriptions.value.trim() ? item.descriptions.value.trim().split(', ') : null,
  aliases: item.aliases.value.trim() ? item.aliases.value.trim().split(', ') : null,
  long_lat: item.long_lat.value.trim() || null,
  place: item.place.value.trim() ? item.place.value.trim().split(', ') : null,
  country: item.countries.value.trim() ? item.countries.value.trim().split(', ') : null,
  partOf: item.partOf.value.trim() ? item.partOf.value.trim().split(', ') : null,
};
    let country = formattedData.find(entry => entry.country === countryName);

    if (!country) {
      country = { country: countryName, events: [] };
      formattedData.push(country);
    }

    country.events.push(event);
  });

  
  function allEvents(){
    return formattedData.flatMap(obj => (obj.events || []).filter(event => event));
  } 
    
    
    function byCountry(){
      return formattedData
    }
  
  
     function groupBy(){
       
       function date(){
           const groupedEvents = {};

  formattedData.forEach((countryObject) => {
    const country = countryObject.country;

    countryObject.events.forEach((event) => {
      const date = new Date(event.date).toISOString().split('T')[0];

      if (!groupedEvents[date]) {
        groupedEvents[date] = [];
      }

      groupedEvents[date].push(event);
    });
  });

          // Convert the object keys to an array and sort them
  const sortedDates = Object.keys(groupedEvents).sort();

  // Create a new object with sorted dates and their corresponding events
  const sortedObject = {};
  sortedDates.forEach(date => {
    sortedObject[date] = groupedEvents[date];
  });
         
  return sortedObject;
         
 // return groupedEvents;
       }
       
       
        function country(){
          return formattedData
        }
       
        return{
          country,
          date
        }
       
     }
  
  function find(){
    
   
      // Function to filter events by a specific date
      function byDate(inputDate) {
        return formattedData.flatMap(obj => (obj.events || []).filter(event => event.date === inputDate));
      }

      // Function to filter events by a specific country
      function byCountry(inputCountry) {
        return formattedData.find(obj => obj.country === inputCountry)?.events || [];
      }

      return {
        byDate,
        byCountry
      };
    
  }
  
  
  
  return {byCountry,
          allEvents,
         groupBy,
         find}
}

/**
 * Function to fetch Wikipedia information for all QIDs in the provided array of events.
 * @param {Array<Object>} events - Array of objects containing QIDs and other details.
 * @returns {Promise<Array<Object>>} - Promise that resolves to an array of objects with Wikipedia information.
 */
async function getAllQIDsInfo(events) {
  try {
    const promises = events.map(async (event) => {
      const QID = event.event.substring(event.event.lastIndexOf("/") + 1);
      const langCode = "en"; // Default language code, you can modify this if needed.

      try {
        const wikipediaInfo = await getData(QID, langCode);
        return { ...event, wikipediaInfo };
      } catch (error) {
        console.error(`Error fetching Wikipedia info for QID ${QID}: ${error.message}`);
        return { ...event, wikipediaInfo: null };
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw error;
  }
}
