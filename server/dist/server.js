"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dictionary_1 = __importDefault(require("./dictionary"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const rest_apis_1 = require("./rest-apis");
const PORT = process.env.PORT || "5081";
const WORDLE_DICTIONARY = process.env.DICTIONARY || "./data/official_wordle_all.txt";
const app = (0, express_1.default)();
const serve_static_1 = __importDefault(require("serve-static"));
// static pages: have Node serve the files for our built React app
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client/build')));
(0, dictionary_1.default)(WORDLE_DICTIONARY).then(dictionary => {
    console.log(`Loaded ${dictionary.length} words`);
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, serve_static_1.default)(path_1.default.resolve(__dirname, '../client/build')));
    // example curl test (doesn't work on Windows):
    // curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["r","e","s","i","n","l","o","t","h","g"], "rules": {"a":["!2","1"],"k":["3"],"y":["4"]}}' http://localhost:8081/getFilteredWords
    app.post('/api/getFilteredWords', (req, res) => {
        let words = (0, rest_apis_1.getFilteredWords)(dictionary, req.body.exclude, req.body.rules);
        res.json(words);
    });
    app.post('/api/getExpandedWords', (req, res) => {
        let words = (0, rest_apis_1.getExpansionWords)(dictionary, req.body.exclude, req.body.rules);
        res.json(words);
    });
    // // static pages: all other GET requests not handled before will return our React app
    app.get('/', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../../client/build', 'index.html'));
    });
    app.get('*', function (req, res) {
        res.sendFile(path_1.default.resolve(__dirname, '../../client/build', req.url.substring(1)));
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log("To open the client, navigate to http://localhost:5081/index.html in your web browser.");
    });
}).catch(err => {
    console.error(`Failed to load dictionary: ${err}`);
});
