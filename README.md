# solidity-voting
An Ethereum based voting app for small scale elections. Nominated 1st prize as Boğaziçi University 2017 Fall [Senior Project](https://www.cmpe.boun.edu.tr/content/ebloc-blockchain-voting).

Based on [truffle/react-box](https://github.com/truffle-box/react-box) boilerplate code

See the demo video [here](https://www.youtube.com/watch?v=yxlFhs991U8)

Read the full project report [here](https://drive.google.com/open?id=1CMbabqKH2M28DD5l4BbtBRgLWB-77_i4)

Find detailed instructions in the project report. More documentation to be added soon.

## Instructions
1. Install npm if you haven't following the instructions [here](https://docs.npmjs.com/getting-started/installing-node)

2. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```
3. Install dependencies
    ```javascript
    npm install
    ```
4. Run the development console.
    ```javascript
    truffle develop
    ```
4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```
5. Run the webpack server
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm start
    ```
