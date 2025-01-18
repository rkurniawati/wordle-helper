import { KnownWord } from "./KnownWord"

export const WordInput = (props: {wordNumber: number, setInitialWord: (kw : KnownWord) => void}) => {
    const handleWordInput  = (e : React.ChangeEvent<HTMLInputElement>) => {
      let inputElem = (e.target as HTMLInputElement)
      let w = inputElem.value
      if (w.length === 5) {
        let kw = new KnownWord(w, "00000")
        props.setInitialWord(kw)
        inputElem.value = ""
      } 
    }
  
    let wordLabel = "Next word"
    if (props.wordNumber === 0) {
      wordLabel = "Initial word"
    } else if (props.wordNumber === 1) {
      wordLabel = "Second word"
    }
    return (
      <div className="center">
        <label htmlFor="wordTextInput" className="inputLabel">{wordLabel} </label><input id="wordTextInput" onChange={handleWordInput}/>
      </div>
    )
  }
  
export default WordInput;