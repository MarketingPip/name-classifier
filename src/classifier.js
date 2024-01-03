import { NlpManager } from 'node-nlp';
import { promises as fs } from 'fs';

const manager = new NlpManager({ languages: ['en'], nlu: { log: false }  });

(async () => {
  const nlp = manager;
  nlp.settings.autoSave = false;
  nlp.addLanguage('en');

  // Load corpus data from a JSON file
  const corpusData = await fs.readFile('./corpus.json', 'utf8');
  const corpus = JSON.parse(corpusData);

  // Add the corpus data to the manager
  nlp.addCorpus(corpus);

  // Train the model
  await nlp.train();
  //nlp.save();

  const minified = true;
  const nlpModel = nlp.export(minified);

  // Save the model to a JSON file
  //await fs.writeFile('nlpModel.json', nlpModel, 'utf8');

  // Process the input text
  let response = await nlp.process('en', "Jared");
  console.log(response)

  response = await nlp.process('en', "Ryan Joesph");
  console.log(response) 

  response = await nlp.process('en', "Jessie Jackson");
  console.log(response) 

  response = await nlp.process('en', "Homer");
  console.log(response) 


  response = await nlp.process('en', "Robert");
  console.log(response)
  
    response = await nlp.process('en', "Bob");
  console.log(response) 
  

    response = await nlp.process('en', "Lorie Lynn");
  console.log(response) 

    response = await nlp.process('en', "Hayley");
  console.log(response) 

    response = await nlp.process('en', "Cassie");
  console.log(response) 


    response = await nlp.process('en', "Bobbi");
  console.log(response) 

  response = await nlp.process('en', "Roberta");
  console.log(response) 

  response = await nlp.process('en', "Bobbi Brown");
  console.log(response) 
  
      response = await nlp.process('en', "Lisa");
  console.log(response) 


  
  if (response.intent == 'None') {
   // console.log('NO_ANSWER');
  } else {
    console.log(`ANSWER: This issue looks similar to a closed issue: ${response.answer}`);
  }
})();
