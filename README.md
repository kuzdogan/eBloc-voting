# solidity-voting
An Ethereum based voting app for small scale elections

Based on [truffle/react-box](https://github.com/truffle-box/react-box) boilerplate code

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
