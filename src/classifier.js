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
  await fs.writeFile('nlpModel.json', nlpModel, 'utf8');

  // Process the input text
  const response = await nlp.process('en', "Hakifred");
  console.log(resoibse)
  if (response.intent == 'None') {
   // console.log('NO_ANSWER');
  } else {
    console.log(`ANSWER: This issue looks similar to a closed issue: ${response.answer}`);
  }
})();
