import { getFilteredWords } from "../modules/wordle-apis";
import {loadDictionary} from "../modules/dictionary";

test("getFilteredWords - defined", () => {
    expect(getFilteredWords).toBeDefined();
})

test("getFilteredWords - returns an array", () => {
    expect(getFilteredWords([], new Set(), new Map())).toBeInstanceOf(Array);
})

test("getFilteredWords - using rules object and exclude array", async () => {
    const dictionary = await loadDictionary();
    const rules = {
        "a": ["!2", "1"],
        "k" : ["3"],
        "y" : ["4"]
    }
    const exclude = "resinlothg".split("")
    
    expect(getFilteredWords(dictionary, exclude, rules)).toEqual(
        expect.arrayContaining([expect.stringMatching(/^[a-z]a[b-z]ky$/i)]))    
})

test("getFilteredWords - wacky pawky", async () => {
    const dictionary = await loadDictionary();
    let rulesStr = '{"a":["!2","1"],"k":["3"],"y":["4"]}'
    let excludeStr = '["r","e","s","i","n","l","o","t","h","g"]'

    // "pawky","mawky","jacky","cacky","wacky"
    expect(getFilteredWords(dictionary, JSON.parse(excludeStr), JSON.parse(rulesStr))).toEqual(
        expect.arrayContaining([expect.stringMatching(/^[a-z]a[b-z]ky$/i)]))   
})

test("getFilteredWords - brust, tryst, frust", async () => {
    const dictionary = await loadDictionary();
    let rulesStr = '{"t":["!2"],"r":["!2"],"s":["!4"]}'
    let excludeStr = '["n", "o", "e", "a", "c", "i", "d"]'

    expect(getFilteredWords(dictionary, JSON.parse(excludeStr), JSON.parse(rulesStr))).toEqual(
        expect.arrayContaining([expect.stringMatching(/^(brust|tryst|rusty|frust|trust|spurt|sturt)$/i)]))   
})

// NOTE: JSON strings have to be double-quoted
//  {
//   exclude: [
//     'n', 't', 'e', 's',
//     'a', 'r', 'i', 'd',
//     'v', 'u', 'h', 'm',
//     'f', 'c', 'k'
//   ],
//   rules: {
//     o: [ '1', '1', '1', '1' ],
//     c: [ '!1', '!3', '0', '0' ],
//     y: [ '4', '4' ]
//   }
// }

test("getFilteredWords - brust, tryst, frust", async () => {
    const dictionary = await loadDictionary();
    let rulesStr = ( '{ "o": [ "1" ],' +
            '"c": [ "!1", "!3", "0" ],' +
            '"y": [ "4", "4" ]}')
    let excludeStr = ('["n", "t", "e", "s",'+
            '"a", "r", "i", "d",'+
            '"v", "u", "h", "m",'+
            '"f", "c", "k"]')

    expect(getFilteredWords(dictionary, JSON.parse(excludeStr), JSON.parse(rulesStr))).toEqual(
         expect.arrayContaining( [ 'coppy', 'colly', 'cobby', 'colby', 'coyly', 'cooly' ]))   
})
