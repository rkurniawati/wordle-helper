# Wordle Helper

## Overview

This is a full-stack React app that will help user solve [Wordle](https://www.nytimes.com/games/wordle/index.html). To use it, you can clone this repo, then launch the application using the steps listed below. 

## How to Use the Wordle Helper

This app is intended to be used as you play Wordle. Either type the words that you have entered in Wordle or choose the word from the list on the right. After you chose the word, click on the letter to change it from grey (incorrect letter) to yellow (letter is used in the word but in the wrong location) or green (letter is in the correct location). 

![](screenshots/wordle-helper.gif)

## How to Run the Application Locally

To run this application locally, you will need to have a NodeJS LTS (as of Jan 2025, v22.13.0) installed. Clone this repo, then follow these steps to launch the front-end and back-end services.

```
npm install 
npm run build 
npm run wordle-helper
```

## Creating and Running using Docker 

To build a docker image with the Wordle Helper app and run it:
```
npm install
npm run build
docker build . -t wordle_helper
docker run -p 5081:5081 wordle_helper
```

## Running the Frontend and Backend Service separately

The application is setup to serve the ReactJS front-end through ExpressJS server. The backend NodeJS source code is located in the `server` directory and the ReactJS front-end code is located in the `client` directory. Before you can do this, disable the static web pages in server/index.js.

### Launching the Backend Service

To start the backend:
```
npm install
npm start server
```

To test the backend APIs:

 - getFilteredWords

    ```
    curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["l", "a", "t", "e", "r", "u", "n", "d", "c", "h", "p"], "rules": {"s":["!0"],"s":["!4"],"o":["!1"], "o" : ["2"]}}' http://localhost:8081/api/getFilteredWords

    curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["r","e","s","i","n","l","o","t","h","g"], "rules": {"a":["!2","1"],"k":["3"],"y":["4"]}}' http://localhost:8081/api/getFilteredWords

    curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["n", "t", "e", "s","a", "r", "i", "d","v", "u", "h", "m","f", "c", "k"], "rules": { "o": [ "1" ],"c": [ "!1", "!3", "0" ],"y": [ "4", "4" ]}}' http://localhost:8081/api/getFilteredWords
    ```

 - getExpandedWords

    ```
    curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["r","e","s","i","n"], "rules": {"a":["!2","1"],"k":["3"],"y":["4"]}}' http://localhost:8081/api/getExpandedWords

    curl --header "Content-Type: application/json" --request POST --data '{"exclude": ["s","i","n", "l", "a", "t", "h"], "rules": { "r": [ "!0" ], "e": [ "!1" ], "o": [ "1" ] }}' http://localhost:8081/api/getExpandedWords

    ```

## Launching the React Frontend

To build the front-end:

```
cd client
yarn install
yarn start
```

To create an optimized production build:
```
cd client
yarn build
```

