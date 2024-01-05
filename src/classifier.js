import { NlpManager } from 'node-nlp';
import { promises as fs } from 'fs';

const manager = new NlpManager({ languages: ['en'] });

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
  let response = await nlp.process('en', "jared");
  console.log(response)

  response = await nlp.process('en', "ryan joesph");
  console.log(response) 

  response = await nlp.process('en', "jessie jackson");
  console.log(response) 

  response = await nlp.process('en', "homer");
  console.log(response) 


  response = await nlp.process('en', "robert");
  console.log(response)
  
    response = await nlp.process('en', "bob");
  console.log(response) 
  

    response = await nlp.process('en', "lorie lynn");
  console.log(response) 

    response = await nlp.process('en', "hayley");
  console.log(response) 

    response = await nlp.process('en', "cassie");
  console.log(response) 


    response = await nlp.process('en', "bobbi");
  console.log(response) 

  response = await nlp.process('en', "roberta");
  console.log(response) 

  response = await nlp.process('en', "bobbi brown");
  console.log(response) 
  
      response = await nlp.process('en', "lisa");
  console.log(response) 



       response = await nlp.process('en', "taylor");
  console.log(response) 


  
  if (response.intent == 'None') {
   // console.log('NO_ANSWER');
  } else {
    console.log(`ANSWER: This issue looks similar to a closed issue: ${response.answer}`);
  }
})();
