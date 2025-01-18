export const WRONG_LETTER = '0' // grey
export const CORRECT_LETTER = '2' // green
export const WRONG_POSITON = '1' // orange/yellow

export class KnownWord {
  word: string;
  locationMarkers: string;
  constructor(word: string, locationMarkers: string) {
    this.word = word;
    this.locationMarkers = locationMarkers;
  }
}
