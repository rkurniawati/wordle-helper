import React, { useEffect } from 'react';
import './App.css';
import { KnownWord } from './KnownWord';
import Rules from './Rules';
import WordInput from './WordInput';
import KnownWords from './KnownWords';
import { InitialWords, SecondWord, Suggestions } from './DisplayedWords';
import { Title, Help } from './Fixtures';
import getWords from './GetWordsFromServer';

const WORDLE_SERVER_API = 'http://localhost:5081/api/getFilteredWords'

enum AppState {
  InitialWords,
  SecondWords,
  FilteredWords
}

const App = () => {
  const [knownWords, setKnownWords] = React.useState<KnownWord[]>([]);
  const [suggestedWords, setSuggestedWords] = React.useState<string[]>([]);
  const [currentState, setCurrentState] = React.useState<AppState>(AppState.InitialWords);

  const addKnownWord = (kw: KnownWord) => {
    setKnownWords([...knownWords, kw]);
  }

  const handleCandidateClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const word = e.currentTarget.innerText;
    setKnownWords([...knownWords, new KnownWord(word, "00000")]);
  }

  const handleLetterClick = (kw : KnownWord, index: number) => {
    let locationMarkers = kw.locationMarkers
    let currentMarker = parseInt(locationMarkers.substring(index, index+1))
    kw.locationMarkers = locationMarkers.substring(0, index) + ((currentMarker+1) % 3) + locationMarkers.substring(index+1)
    setKnownWords([...knownWords])
  }

  useEffect(() => {
    async function getWordSuggestions() {
      if (knownWords) {
        let rules : Rules = new Rules(knownWords)
        let words : string[] = await getWords(WORDLE_SERVER_API, rules)
        setSuggestedWords(words)
        setSuggestedWords(words.sort())
      }
    }
    if (currentState !== AppState.InitialWords) {
      getWordSuggestions()
    }
  }, [knownWords, currentState])

  useEffect(() => {
    if (knownWords.length === 1) {
      setCurrentState(AppState.SecondWords)
    } else if (knownWords.length > 1) {
      setCurrentState(AppState.FilteredWords)
    }
  }, [knownWords])

  let displayedWords : JSX.Element;
  switch(currentState) {
    case AppState.InitialWords:
      displayedWords = <InitialWords onClickHandler={handleCandidateClick}/>
      break;
    case AppState.SecondWords:
      displayedWords = <SecondWord  firstWord={knownWords[0].word} suggestedWords={suggestedWords} onClickHandler={handleCandidateClick}/>
      break;
    default:
      displayedWords = <Suggestions suggestedWords={suggestedWords} onClickHandler={handleCandidateClick}/>
      break;
  }


  return (
    <div>
      <Title/>
      <Help/>
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
