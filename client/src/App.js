import './App.css';
import React, {useState, useEffect} from 'react'

const WRONG_LETTER = '0' // grey
const CORRECT_LETTER = '2' // green
const WRONG_POSITON = '1' // orange/yellow

// a known word is a word that has been tried before and has a known location markers (grey, green, orange boxes)
// eg. 'berti', '00000' // if all letters are incorrect
// eg. 'berti', '20000' // if 'b' is correct, but the rest are incorrect
// eg. 'berti', '21100' // if 'b' is correct, 'e' and 'r' are needed but are in incorrect locations, the rest are incorrect. 
class KnownWord {
  constructor(word, locationMarkers) {
      this.word = word.toLowerCase();
      this.locationMarkers = locationMarkers;
  }
}

class RuleBuilder {
    
  constructor(knownWords) {
      this.knownWords = knownWords;
      this.constructRules();
  }

  constructRules() {
      this.rules = {}
      this.excludeLetter = []
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

function Title() {
  return (
    <h1 className="App-header">Wordle Helper</h1>
  );
}


function KnownWordDisplay(props) {
  const getLetterClass = (marker) => {
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
      {word.split("").map((letter, idx) => <td key={props.idx + "-" + idx } 
      onClick={(e) => props.flipHandler(props.knownWord, idx)} className={"letter " + getLetterClass(locationMarkers.substring(idx, idx+1))}>{letter}</td>)}
    </tr>
  );
}

function KnownWords(props) {
  return (
    <div>
      <h2>Known Words</h2>
      <table><tbody>
        {props.knownWords.map((kw, idx) => <KnownWordDisplay key={idx} knownWord={kw} index={idx} flipHandler={props.flipHandler}/>)}
      </tbody></table>
    </div>
  );
}

async function getWords(apiName, rules, exclude) {
  let response = await fetch(apiName, {
    'method': 'POST',
    'headers': { 
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({exclude: exclude, rules: rules})
  });
  let words = await response.json();
  return words;
}

function Suggestions(props) {

  let suggestedWords = props.suggestedWords;
  if (suggestedWords === undefined) {
    suggestedWords = [];
  }

  let title = "Suggestions"
  if (props.title) {
    title = props.title
  }

  return (<div>
    <h2>{title}</h2>
    <div className="scrollable"> 
    {suggestedWords.map((word, idx) => <div key={idx} onClick={e=>props.onClickHandler(e)}>{word}</div>)}
    </div>
  </div>)
}

function InitialWords(props) {
  const words = ['notes', 'resin', 'tares', 'senor']
  return (<div>
    <h2>Suggestions</h2>
    <div className="scrollable"> 
    {words.map((word, idx) => <div key={idx} onClick={e=>props.onClickHandler(e)}>{word}</div>)}
    </div>
  </div>)
}

function SecondWord(props) {
  const words = {
    'notes': 'acrid', 
    'resin': 'loath', 
    'tares': 'chino', 
    'senor': 'ducat'}

  let secondWord = null
  if (props.firstWord && words[props.firstWord]) {
    secondWord = words[props.firstWord]
  }

  return (<div>
    {secondWord && <div><label htmlFor="secondWord" className="inputLabel">Good second word: </label><div id="secondWord" onClick={e=>props.onClickHandler(e)}>{secondWord}</div>  (click to choose)</div>}
    <Suggestions title="Suggestions" suggestedWords={props.suggestedWords} onClickHandler={props.onClickHandler}/>
  </div>)
}

const WordInput = ({wordNumber, setInitialWord}) => {
  const handleWordInput  = (e) => {
    let w = e.target.value
    if (w.length === 5) {
      let kw = new KnownWord(w, "00000")
      setInitialWord(kw)
      console.log(wordLabel + " word set to " + w);
      e.target.value = ""
    } else {
      console.log(wordLabel + " word candidate " + w);
    }
  }

  let wordLabel = "Next word"
  if (wordNumber === 0) {
    wordLabel = "Initial word"
  } else if (wordNumber === 1) {
    wordLabel = "Second word"
  }
  return (
    <div className="center">
      <label htmlFor="wordTextInput" className="inputLabel">{wordLabel} </label><input id="wordTextInput" onChange={handleWordInput}/>
    </div>
  )
}

// # 1. If you start with NOTES, ACRID
// # 2. If you start with RESIN, LOATH
// # 3. If you start with TARES, CHINO
// # 4. If you start with SENOR, DUCAT

function App() {
  const INITIAL_WORDS = 1
  const SECOND_WORDS = 2
  const FILTERED_WORDS = 3 // get filtered suggestions based on known words
  const EXPANDED_WORDS = 4 // get set of expanded filtered words

  const [wordsToDisplay, setWordsToDisplay] = useState(INITIAL_WORDS)
  const [suggestedWords, setSuggestions] = useState([]);
  const [knownWords, setKnownWords] = useState([
    //new KnownWord("notes", "00101"),
    //new KnownWord("acrid", "00100"),
  ])

  const addKnownWord = (word) => {
    setKnownWords([...knownWords, word])
  }

  const handleCandidateClick  = (e) => {
    let w = e.target.innerText
    let kw = new KnownWord(w, "00000")
    setKnownWords([...knownWords, kw])
  }

  const handleLetterClick = (kw, index) => {
    let locationMarkers = kw.locationMarkers
    let currentMarker = parseInt(locationMarkers.substring(index, index+1))
    kw.locationMarkers = locationMarkers.substring(0, index) + ((currentMarker+1) % 3) + locationMarkers.substring(index+1)
    setKnownWords([...knownWords])
  }


  useEffect(() => {
    async function getSuggestions() {
      if (knownWords !== null) {
        let rb = new RuleBuilder(knownWords)
        let apiName = '/api/getFilteredWords'
        if (wordsToDisplay === EXPANDED_WORDS) {
          apiName = '/api/getExpandedWords'
        }
        let words = await getWords(apiName, rb.getRules(), rb.getExclude())
        words.sort()
        console.log(words)
        setSuggestions(words)
      }
    }
    if (wordsToDisplay !== INITIAL_WORDS) {
      console.log("Getting suggestions...")
      getSuggestions()
    } else {
      console.log("Not calling suggestion API")
      setSuggestions([])
    }
  }, [knownWords, wordsToDisplay])

  useEffect(() => {
    if (knownWords) {
      if (knownWords.length === 0) {
        setWordsToDisplay(INITIAL_WORDS)
      } else if (knownWords.length === 1) {
        setWordsToDisplay(SECOND_WORDS)
      } else {
        setWordsToDisplay(FILTERED_WORDS)
      }
    }
  }, [knownWords])

  let displayedWords = null
  switch(wordsToDisplay) {
    case INITIAL_WORDS:
      displayedWords = <InitialWords onClickHandler={handleCandidateClick}/>
      break;
    case SECOND_WORDS:
      displayedWords = <SecondWord  firstWord={knownWords[0].word} suggestedWords={suggestedWords} onClickHandler={handleCandidateClick}/>
      break;
    case EXPANDED_WORDS:
    case FILTERED_WORDS:
    default:
      displayedWords = <Suggestions suggestedWords={suggestedWords} onClickHandler={handleCandidateClick}/>
      break;
  }

  return (
    <div>
      <Title/>
      <p className="center">Choose one of these suggested words, or type your own.</p>

    <WordInput wordNumber={knownWords.length} setInitialWord={addKnownWord}/>
    <table className="bigTable">
      <tbody>
        <tr>
        <td className="bigCell">
          <KnownWords knownWords={knownWords} flipHandler={handleLetterClick}/>
        </td>
        <td className="bigCell">
          {displayedWords}
        </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
  }

export default App;
