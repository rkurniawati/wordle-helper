import { KnownWord, WRONG_LETTER, WRONG_POSITON, CORRECT_LETTER } from './KnownWord';

class Rules {
    private letterRules: Map<string, string[]>;
    private exclude: string[];


    constructor(knownWords: KnownWord[]) {
        this.letterRules = new Map<string, string[]>();
        this.exclude = [];
        this.constructRulesAndExclude(knownWords);
    }

    private constructRulesAndExclude(knownWords: KnownWord[]) : void {
        knownWords.forEach((kw) => {
            let word = kw.word;
            let locationMarkers = kw.locationMarkers;
            for (let i = 0; i < word.length; i++) {
                let letter = word.charAt(i);
                let marker = locationMarkers.charAt(i);
                switch(marker) {
                    case WRONG_LETTER:
                        if (!this.exclude.includes(letter)) {
                            this.exclude.push(letter);
                        }
                        break;
                    case CORRECT_LETTER:
                        if (!this.letterRules.has(letter)) {
                            this.letterRules.set(letter, []);
                        }
                        this.letterRules.get(letter)?.push(i.toString());
                        break;
                    case WRONG_POSITON:
                        if (!this.letterRules.has(letter)) {
                            this.letterRules.set(letter, []);
                        }
                        this.letterRules.get(letter)?.push(`!${i.toString()}`);
                        break;
                    default:
                        console.error("Unknown marker: " + marker);
                        break;

                }
            }
        });        
    }
    public getLetterRules() : Map<string, string[]> {
        return this.letterRules;
    }

    public getExclude() : string[] {
        return this.exclude;
    }
}

export default Rules;