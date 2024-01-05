const data = {"female":["na","ia","ne","ta","la","ra","ah","da","ka","ie","ja","sa","ha","te","le"],"male":["an","on","ng","us","in","io","er","as","ar","el","is","ro","no","en","ur"],"top_chars":{"female":"na","male":"an"}}

function transformData(data) {
  const transformedData = {
    "female": [],
    "male": [],
    "top_chars": {}
  };

  for (const gender in data) {
    if (data.hasOwnProperty(gender)) {
      const keys = data[gender];

      // Extract key names into arrays
      transformedData[gender] = keys;

      // Use the first item as the top item for the "top_chars" key (already have been sorted)
      transformedData["top_chars"][gender] = keys[0];
    }
  }

  return transformedData;
}


const transformedResult = transformData(data);
console.log(transformedResult);

//console.log(exampleData)

function findGender(name) {

  const data = transformedResult
//console.log(data)
  const lastTwoLetters = name.slice(-2);

  if (data.female.includes(lastTwoLetters)) {
    return { name, gender: "female" };
  } else if (data.male.includes(lastTwoLetters)) {
    return { name, gender: "male" };
  } else {
    return { name, gender: "unknown" };
  }
}

function testFindGender() {
  const testData = [
  { name: "Lana", expected: "female" },
  { name: "Brian", expected: "male" },
  { name: "Alex", expected: "male" },
  { name: "Maria", expected: "female" },
  { name: "Daniel", expected: "male" },
  { name: "Sophia", expected: "female" },
  { name: "John", expected: "male" },
  { name: "Eva", expected: "female" },
  { name: "Samuel", expected: "male" },
  { name: "Olivia", expected: "female" },
  { name: "William", expected: "male" },
  { name: "Isabella", expected: "female" },
  { name: "Ethan", expected: "male" },
  { name: "Ava", expected: "female" },
  { name: "Matthew", expected: "male" },
  { name: "Emily", expected: "female" },
  { name: "Christopher", expected: "male" },
  { name: "Emma", expected: "female" },
  { name: "Michael", expected: "male" },
  { name: "Jared", expected: "male" },
  { name: "Sierra", expected: "female" },
  { name: "John", expected: "male" },
  { name: "Mary", expected: "female" },
  { name: "Alex", expected: "male" },
  { name: "Emily", expected: "female" },
  { name: "Chris", expected: "male" },
  { name: "Taylor", expected: "female" },
  { name: "Jordan", expected: "male" },
  { name: "Amanda", expected: "female" },
  { name: "Ryan", expected: "male" },
  { name: "Emma", expected: "female" },
  { name: "Amelia", expected: "female" },
  { name: "Sean", expected: "male" },
  { name: "Noah", expected: "male" },
  { name: "Olivia", expected: "female" },
  { name: "Grace", expected: "female" },
  { name: "Lucas", expected: "male" },
  { name: "Chloe", expected: "female" },
  { name: "Aaron", expected: "male" },
  { name: "Mia", expected: "female" },
  { name: "Jacob", expected: "male" },
  { name: "Sophie", expected: "female" },
  { name: "Nicholas", expected: "male" },
  { name: "Zoe", expected: "female" },
  { name: "Justin", expected: "male" },
  { name: "Ella", expected: "female" },
  { name: "Caleb", expected: "male" },
  { name: "Avery", expected: "female" },
  { name: "Dylan", expected: "male" },
  { name: "Victoria", expected: "female" },
  { name: "Gabriel", expected: "male" },
  { name: "Hannah", expected: "female" },
  { name: "Jordan", expected: "male" },
  { name: "Natalie", expected: "female" },
  { name: "Cameron", expected: "male" },
  { name: "Leah", expected: "female" },
  { name: "Logan", expected: "male" },
  { name: "Madison", expected: "female" },
  { name: "Owen", expected: "male" },
  { name: "Aria", expected: "female" },
  { name: "Connor", expected: "male" },
  { name: "Sofia", expected: "female" },
  { name: "Mason", expected: "male" },
  { name: "Lily", expected: "female" },
  { name: "Evan", expected: "male" },
  { name: "Scarlett", expected: "female" },
  { name: "Nathan", expected: "male" },
  { name: "Addison", expected: "female" },
  { name: "Isaac", expected: "male" },
  { name: "Brooklyn", expected: "female" },
  { name: "Jackson", expected: "male" },
  { name: "Claire", expected: "female" },
  { name: "Tyler", expected: "male" },
  { name: "Peyton", expected: "female" },
  { name: "Henry", expected: "male" },
  { name: "Grace", expected: "female" },
  { name: "Elijah", expected: "male" },
  { name: "Mackenzie", expected: "female" },
  { name: "Colton", expected: "male" },
  { name: "Katherine", expected: "female" },
  { name: "Julian", expected: "male" },
  { name: "Aubrey", expected: "female" },
  { name: "Brayden", expected: "male" },
  { name: "Lillian", expected: "female" },
  { name: "Wyatt", expected: "male" },
  { name: "Riley", expected: "female" },
  { name: "Gabriel", expected: "male" },
  { name: "Ellie", expected: "female" },
  { name: "Dominic", expected: "male" },
  { name: "Harper", expected: "female" },
  { name: "Isaiah", expected: "male" },
  { name: "Annabelle", expected: "female" },
  { name: "Levi", expected: "male" },
  { name: "Aaliyah", expected: "female" },
  { name: "Jaxon", expected: "male" },
  { name: "Zara", expected: "female" },
  { name: "Josiah", expected: "male" },
  { name: "Mila", expected: "female" },
  { name: "Xavier", expected: "male" },
  { name: "Nora", expected: "female" },
  { name: "Sebastian", expected: "male" },
  { name: "Savannah", expected: "female" },
  { name: "Jonathan", expected: "male" },
  { name: "Alyssa", expected: "female" },
  { name: "Benjamin", expected: "male" },
  { name: "Penelope", expected: "female" },
  { name: "Carter", expected: "male" },
  { name: "Aria", expected: "female" },
  { name: "Liam", expected: "male" },
  { name: "Addison", expected: "female" },
    // Add more test cases as needed
  ];

  let passMale = 0;
  let passFemale = 0;
  let passUnknown = 0;

  testData.forEach((data) => {
    const result = findGender(data.name);
    const status = result.gender === data.expected ? "PASS" : "FAIL";
    console.log(`${data.name}: Expected ${data.expected}, Got ${result.gender} - ${status}`);

    if (status === "PASS") {
      if (result.gender === "male") {
        passMale++;
      } else if (result.gender === "female") {
        passFemale++;
      } else {
        passUnknown++;
      }
    }
  });

  const totalTests = testData.length;
  const successRate = ((passMale + passFemale + passUnknown) / totalTests) * 100;

  console.log("\nFinal Results:");
  console.log(`Passed - Male: ${passMale}`);
  console.log(`Passed - Female: ${passFemale}`);
  console.log(`Passed - Unknown: ${passUnknown}`);
  console.log(`Success Rate: ${successRate.toFixed(2)}% - based on ${totalTests} names`);
}

// Run the test
testFindGender();
