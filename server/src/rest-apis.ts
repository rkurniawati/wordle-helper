import Rules from './rules';
import KnownWord from './knownword';

export function getFilteredWords(words : string[], excludeArray: Set<string>, rulesObject: Map<string, string[]>) {
    let exclude = new Set(excludeArray)
    let rules = new Map(Object.entries(rulesObject))
    let result = []
    for(let w of words) {
        let valid = true

        // check if the word contains any of the excluded letters
        exclude.forEach(e => {
            // yellow and green override gray
            // only use the exclude rule if the letter is not in the rules
            if (!rules.get(e)) {
                if (w.indexOf(e) >= 0) {
                    valid = false
                }
            }
        })

        // don't bother checking the rules if the word already failed the exclude test
        if (!valid) continue

        // check the rules
        // - if the rule is a number, the letter must be at that index
        // - if the rule is "!number", the letter cannot be at that index

        // make sure to use the "of" key word in for iterator to get the values
        // if you don't specify keys, you'll get the (key, value) pairs
        for (let ch of rules.keys()) {
            for (let r of rules.get(ch)) {
                if (r.substring(0, 1) === "!") {
                    let idx = parseInt(r.substring(1))
                    // ch cannot be at index idx
                    if (w.charAt(idx) == ch) {
                        valid = false
                        break
                    }
                    // however, ch has to exist somewhere
                    if (w.indexOf(ch) < 0) {
                        valid = false
                        break
                    }
                } else {
                    let idx = parseInt(r)
                    // ch must be at index idx
                    if (w.charAt(idx) != ch) {
                        valid = false
                        break
                    }   
                }
            }
            if (!valid) break
        }

        if (valid) {
            result.push(w)
        }
    }
    return result;
}

// This is similar to getFilteredWords, but it only checks characters that have been tried
// but not necessarily failed. This is useful for expanding the list of possible words
export function getExpansionWords(words: string[], excludeArray: string[], rulesObject: Map<string, string[]>) {
    let exclude = new Set(excludeArray)
    //console.log(excludeArray)

    // add all the letters in the rulesObject to the exclude set
    // these are characters that have been tried, but not necessarily failed
    for(let ch in rulesObject) {
        exclude.add(ch)
        //console.log("adding ", ch)
    }
    //console.log(exclude)
    let result = []
    for(let w of words) {
        let valid = true

        exclude.forEach(e => {
            if (w.indexOf(e) >= 0) {
                valid = false
            }
        })
        if (!valid) continue

        result.push(w)
    }
    return result;
}
