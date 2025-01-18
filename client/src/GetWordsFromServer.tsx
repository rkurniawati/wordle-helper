import Rules from './Rules'

export const getWords = async (apiName: string, rules: Rules) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({rules: Object.fromEntries(rules.getLetterRules()), exclude: rules.getExclude()})
  };
  console.log("Requesting words with rules: " + requestOptions.body)
  let response = fetch(apiName, requestOptions)
  let data : Response = (await response)
  let json : string[] = await data.json()
  return json
}

export default getWords;