const WRONG_LETTER = '0' // grey
const CORRECT_LETTER = '2' // green
const WRONG_POSITON = '1' // orange/yellow

class RuleBuilder {
    
    constructor(knownWords) {
        this.knownWords = knownWords;
        this.constructRules();
    }

    constructRules() {
        this.rules = new Object()
        this.excludeLetter = new Array()
        this.knownWords.forEach(knownWord => {
            let m = knownWord.locationMarkers
            let w = knownWord.word.split("")
            w.forEach((letter, index) => {
                let l = m.substring(index, index + 1)
                switch (l) {
                    case WRONG_LETTER:
                        if (!this.excludeLetter.includes(letter)) {
                            this.excludeLetter.push(letter)
                        }
                        break;
                    case CORRECT_LETTER:
                        if (this.rules[letter] === undefined) {
                            this.rules[letter] = [index.toString()]
                        } else {
                            let currentRules = this.rules[letter]
                            currentRules.push(index.toString())
                        }
                        break;
                    case WRONG_POSITON:
                        if (this.rules[letter] === undefined) {
                            this.rules[letter] = ["!" + index.toString()]
                        } else {
                            let currentRules = this.rules[letter]
                            currentRules.push("!"+index.toString())
                        }
                        break;
                    default:
                        console.log('Error - unknown location marker: ' + l)
                        break;
                }
            })
        })
    }

    getRules() {
        return this.rules;
    }

    getExclude() {
        return this.excludeLetter;
    }
}

export default RuleBuilder;