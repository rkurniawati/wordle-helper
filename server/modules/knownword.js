// a known word is a word that has been tried before and has a known location markers (grey, green, orange boxes)
// eg. 'berti', '00000' // if all letters are incorrect
// eg. 'berti', '10000' // if 'b' is correct, but the rest are incorrect
// eg. 'berti', '12200' // if 'b' is correct, 'e' and 'r' are needed but are in incorrect locations, the rest are incorrect. 
class KnownWord {
    constructor(word, locationMarkers) {
        this.word = word.toLowerCase();
        this.locationMarkers = locationMarkers;
    }
}

export default KnownWord;