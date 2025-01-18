import KnownWord from './knownword';

export default class Rules {

    // this is the representation of the rules for each letter
    private rules: Map<string, string[]>;
    private excludedLetter: Set<string>;
    
    private static readonly WRONG_LETTER = '0' // grey
    private static readonly CORRECT_LETTER = '2' // green
    private static readonly WRONG_POSITON = '1' // orange/yellow


    /**
     * This constructor takes the known words and constructs the rules for each letter
     * @param knownWords this is the representation from the UI, list of words and their location markers
     */
    constructor(knownWords: KnownWord[]) {
        this.rules = new Map<string, string[]>();
        this.excludedLetter = new Set<string>();
        this.constructRules(knownWords);
    }

    private constructRules(knownWords: KnownWord[]) {
        for (let knownWord of knownWords) {
            for (let i = 0; i < knownWord.word.length; i++) {
                let letter = knownWord.word.charAt(i);
                let rule = i.toString();
                let locationCode: string = knownWord.locationMarkers.charAt(i);
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

    private addRule(letter: string, rule: string) {
        const letterRules = this.rules.get(letter);
        if (letterRules) {
            letterRules.push(rule);
        } else {
            this.rules.set(letter, [rule]);
        }
    }
}