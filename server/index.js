import {exit} from "process"
import express from 'express'
import path from "path"
import cors from 'cors'

import { loadDictionary } from "./modules/dictionary.js"
import { getFilteredWords, getExpansionWords } from "./modules/wordle-apis.js"

const PORT = process.env.PORT || 3001;

const dictionary = loadDictionary()

const app = express()

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// if the dictionary is loaded, we can start accepting requests to /api/*
dictionary.then(dict => {
    console.log("dictionary loaded")
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // example curl test (doesn't work on Windows):
    // curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["r","e","s","i","n","l","o","t","h","g"], "rules": {"a":["!2","1"],"k":["3"],"y":["4"]}}' http://localhost:8081/getFilteredWords
    app.post('/api/getFilteredWords', (req, res) => {
        //console.log('Got body:', req.body)
        let words = getFilteredWords(dict, req.body.exclude, req.body.rules)
        //console.log('Response: ', words)
        res.json(words)
    })

    app.post('/api/getExpandedWords', (req, res) => {
        //console.log('Got body:', req.body)
        let words = getExpansionWords(dict, req.body.exclude, req.body.rules)
        //console.log('Response: ', words)
        res.json(words)
    })

    // All other GET requests not handled before will return our React app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });
}).catch(err => {
    console.error("Error: " + err)
    exit(1)
})

