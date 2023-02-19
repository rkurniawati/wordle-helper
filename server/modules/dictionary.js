
const WORDLE_DICTIONARY = "./server/data/official_wordle_all.txt"

async function loadDictionary() {
    // read the dictionary
    const fs = require("fs")
    try {
        const dictionary = await fs.promises.readFile(WORDLE_DICTIONARY, "utf8")
        return dictionary.replace(/\r\n/g, "\n").split("\n")
    } catch (err) {
        console.error(err)
    }
    return None
}

export { loadDictionary }