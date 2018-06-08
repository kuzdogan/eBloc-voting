# solidity-voting
An Ethereum based voting app for small scale elections as Boğaziçi University Senior Project by:
- Ali Kireçligöl
- Kaan Uzdoğan

Nominated 1st prize as Boğaziçi University 2017 Fall [Senior Project](https://www.cmpe.boun.edu.tr/content/ebloc-blockchain-voting).

Based on [truffle/react-box](https://github.com/truffle-box/react-box) boilerplate code

See the demo video [here](https://www.youtube.com/watch?v=yxlFhs991U8)

Read the full project report [here](https://drive.google.com/open?id=1CMbabqKH2M28DD5l4BbtBRgLWB-77_i4)

Find detailed instructions in the project report. More documentation to be added.

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
4. Install Ganache test network (use `sudo` if you get permission error)
    ```javascript
     npm install -g ganache-cli
    ```
5. Start test network on port 9545, use your own port in the truffle.js file 
    ```
    ganache-cli -p 9545     
    ````
6. Open a new terminal in the folder. Compile and migrate the smart contracts.
    ```javascript
    truffle compile
    ````
    and then
    ```
    truffle migrate --network development
    ```
7. Before running copy the contract addres from test network console output and paste to src/pages/vote/Vote.jsx file line 120. Contract address is currently hard coded.

8. Run the webpack server
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm start
    ```
