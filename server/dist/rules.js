"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rules {
    /**
     * This constructor takes the known words and constructs the rules for each letter
     * @param knownWords this is the representation from the UI, list of words and their location markers
     */
    constructor(knownWords) {
        this.rules = new Map();
        this.excludedLetter = new Set();
        this.constructRules(knownWords);
    }
    constructRules(knownWords) {
        for (let knownWord of knownWords) {
            for (let i = 0; i < knownWord.word.length; i++) {
                let letter = knownWord.word.charAt(i);
                let rule = i.toString();
                let locationCode = knownWord.locationMarkers.charAt(i);
                switch (locationCode) {
                    case Rules.WRONG_LETTER:
                        this.excludedLetter.add(letter);
                        break;
                    case Rules.CORRECT_LETTER:
                        this.addRule(letter, rule);
                        break;
                    case Rules.WRONG_POSITON:
                        this.addRule(letter, "!" + rule);
                        break;
                }
                const letterRules = this.rules.get(letter);
            }
        }
    }
    addRule(letter, rule) {
        const letterRules = this.rules.get(letter);
        if (letterRules) {
            letterRules.push(rule);
        }
        else {
            this.rules.set(letter, [rule]);
        }
    }
}
Rules.WRONG_LETTER = '0'; // grey
Rules.CORRECT_LETTER = '2'; // green
Rules.WRONG_POSITON = '1'; // orange/yellow
exports.default = Rules;
