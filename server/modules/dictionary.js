
async function loadDictionary(dictionaryFile) {
    // read the dictionary
    const fs = require("fs")
    try {
        const dictionary = await fs.promises.readFile(dictionaryFile, "utf8")
        return dictionary.replace(/\r\n/g, "\n").split("\n")
    } catch (err) {
        console.error(err)
    }
    return None
}

export { loadDictionary }