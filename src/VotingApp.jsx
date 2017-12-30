import React, { Component } from 'react'
import SmartVotingContract from '../build/contracts/SmartVoting.json'
import getWeb3 from './utils/getWeb3'
import {Button} from 'react-bootstrap'

class VotingApp extends Component {
	constructor(props) {
    super(props)

    this.state = {
      web3: null,
      smartVotingInstance: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3,
        owner: null
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }  

  instantiateContract() {
    const contract = require('truffle-contract')
    const smartVoting = contract(SmartVotingContract)
    smartVoting.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.

    smartVoting.deployed().then(instance => {
    	this.smartVotingInstance = instance;
    	return this.smartVotingInstance.owner()
    }).then(owner => { // Arrow function for using "this"
    	this.setState({owner: owner});
    })

    this.state.web3.eth.getAccounts((error, accounts) => {
    	console.log(accounts);
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Voting App</h1>
              <p>Please select to create a voting or vote in an existing election</p>
              <Button bsStyle="primary" href="/create"> Create Election </Button>
              <Button bsStyle="primary" href="/vote"> Vote in an Election </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }  
}

export default VotingApp