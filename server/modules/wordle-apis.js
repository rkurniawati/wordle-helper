

function getFilteredWords(words, excludeArray, rulesObject) {
    let exclude = new Set(excludeArray)
    let rules = new Map(Object.entries(rulesObject))
    let result = []
    for(let w of words) {
        let valid = true


        exclude.forEach(e => {
            // yellow and green override gray
            // only use the exclude rule if the letter is not in the rules
            if (!rules.get(e)) {
                if (w.indexOf(e) >= 0) {
                    valid = false
                }
            }
        })

        if (!valid) continue
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
                    // however, ch has to exist somehwere
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

function getExpansionWords(words, excludeArray, rulesObject) {
    let exclude = new Set(excludeArray)
    console.log(excludeArray)
    for(let ch in rulesObject) {
        exclude.add(ch)
        console.log("adding ", ch)
    }
    console.log(exclude)
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

export {getFilteredWords, getExpansionWords}