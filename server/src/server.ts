import express from 'express'
import loadDictionary from './dictionary';
import cors from 'cors';
import path from 'path';
import { getFilteredWords, getExpansionWords } from './rest-apis';

const PORT : string = process.env.PORT || "5081";
const WORDLE_DICTIONARY : string = process.env.DICTIONARY || "./data/official_wordle_all.txt"
const app : express.Express = express();

import serveStatic from 'serve-static'


// static pages: have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));


loadDictionary(WORDLE_DICTIONARY).then(dictionary => {
    console.log(`Loaded ${dictionary.length} words`);
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(serveStatic(path.resolve(__dirname, '../client/build')))

    // example curl test (doesn't work on Windows):
    // curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["r","e","s","i","n","l","o","t","h","g"], "rules": {"a":["!2","1"],"k":["3"],"y":["4"]}}' http://localhost:8081/getFilteredWords
    app.post('/api/getFilteredWords', (req, res) => {
        let words = getFilteredWords(dictionary, req.body.exclude, req.body.rules)
        res.json(words)
    })

    app.post('/api/getExpandedWords', (req, res) => {
        let words = getExpansionWords(dictionary, req.body.exclude, req.body.rules)
        res.json(words)
    })

    // // static pages: all other GET requests not handled before will return our React app
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
    });
    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../../client/build', req.url.substring(1)));
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log("To open the client, navigate to http://localhost:5081/index.html in your web browser.")
    });    

}).catch(err => {
    console.error(`Failed to load dictionary: ${err}`);
});