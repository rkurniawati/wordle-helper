// # 1. If you start with NOTES, ACRID
// # 2. If you start with RESIN, LOATH
// # 3. If you start with TARES, CHINO
// # STARE CHINO
// # 4. If you start with SENOR, DUCAT

import {exit} from "process"
import express from 'express'
import path from "path"
import cors from 'cors'

import { loadDictionary } from "./modules/dictionary.js"
import { getFilteredWords, getExpansionWords } from "./modules/wordle-apis.js"

import KnownWord from "./modules/knownword.js"
import RuleBuilder from "./modules/rulebuilder.js"

const knownWords = [
    new KnownWord("NOTES", "10000"),
    new KnownWord("ACRID", "01200"),
    new KnownWord("TRASH", "01001"),
]

const rulebuilder = new RuleBuilder(knownWords)
console.log("Rules ", rulebuilder.getRules())
console.log("Exclude ", rulebuilder.getExclude())

const dictionary = loadDictionary()

const app = express()

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../client/build')));

// if the dictionary is loaded, we can start accepting requests
dictionary.then(dict => {
    console.log("dictionary loaded")
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // example curl test (doesn't work on Windows):
    // curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["r","e","s","i","n","l","o","t","h","g"], "rules": {"a":["!2","1"],"k":["3"],"y":["4"]}}' http://localhost:8081/getFilteredWords
    app.post('/api/getFilteredWords', (req, res) => {
        console.log('Got body:', req.body)
        let words = getFilteredWords(dict, req.body.exclude, req.body.rules)
        console.log('Response: ', words)
        res.json(words)
    })

    app.post('/api/getExpandedWords', (req, res) => {
        console.log('Got body:', req.body)
        let words = getExpansionWords(dict, req.body.exclude, req.body.rules)
        console.log('Response: ', words)
        res.json(words)
    })

    // All other GET requests not handled before will return our React app
    // app.get('*', (req, res) => {
    //     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    // });

    app.listen(8081, () => {
        console.log("listening on port 8081")
    });
}).catch(err => {
    console.error("Error: " + err)
    exit(1)
})

