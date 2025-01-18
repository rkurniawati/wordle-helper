export const InitialWords = (props: {onClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void}) => {
    const words = ['notes', 'resin', 'tares', 'senor'];
    return  (<div>
      <h2>Suggestions</h2>
      <div className="scrollable"> 
      {words.map((word, idx) => <div key={idx} onClick={e=>props.onClickHandler(e)}>{word}</div>)}
      </div>
    </div>);
  }
  
export const SecondWord = (props: {firstWord: string, suggestedWords: string[], onClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void}) => {
    type Word2WordMap = {[key: string]: string};
  
    const words : Word2WordMap = {
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
  
export const Suggestions = (props: {suggestedWords: string[], onClickHandler: (e: React.MouseEvent<HTMLDivElement>) => void, title?: string}) => {
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
  
