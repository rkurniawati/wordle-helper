import { KnownWord, CORRECT_LETTER, WRONG_LETTER, WRONG_POSITON } from './KnownWord';

const KnownWordDisplay = (props: {knownWord: KnownWord, index: number, flipHandler: (kw: KnownWord, idx: number) => void}) => {
  const getLetterClass = (marker: string) => {
    switch(marker) {
      case WRONG_LETTER:
        return 'wrong-letter'
      case CORRECT_LETTER:
        return 'correct-letter'
      case WRONG_POSITON:
        return 'wrong-position'
      default:
        console.error("Unknown marker: " + marker)
    }
  }

  let word = props.knownWord.word
  let locationMarkers = props.knownWord.locationMarkers

  return (
    <tr>
      {word.split("").map((letter, idx) => <td key={props.index + "-" + idx } 
      onClick={(e) => props.flipHandler(props.knownWord, idx)} className={"letter " + getLetterClass(locationMarkers.substring(idx, idx+1))}>{letter}</td>)}
    </tr>
  );
}

const KnownWords = (props: {knownWords: KnownWord[], flipHandler: (kw: KnownWord, idx: number) => void}) => {
  return (
    <div>
      <h2>Known Words</h2>
      <table><tbody>
        {props.knownWords.map((kw, idx) => <KnownWordDisplay key={idx} knownWord={kw} index={idx} flipHandler={props.flipHandler}/>)}
      </tbody></table>
    </div>
  );
}

export default KnownWords;