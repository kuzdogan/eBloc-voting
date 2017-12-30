import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import SmartVotingContract from '../../../build/contracts/SmartVoting.json'
import getWeb3 from '../../utils/getWeb3'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

class CreateVoting extends Component{
	constructor(props) {
    super(props)

    this.state = {
      web3: null,
      owner: null,
      smartVotingInstance: null
    }
    this.instantiateContract = this.instantiateContract.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3,
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
  	if(this.state.web3){
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
	  } else
	  console.log("NOT YET");
  }

	render(){
		return(
		<div className="page">
			<h1> Here you can create votings</h1>
			<p> Select starting date </p>
			<Datetime defaultValue={new Date()}/>
			<p> Select end date </p>
			<Datetime defaultValue={new Date()}/>
			<Button bsStyle="primary" onClick={this.instantiateContract}>
			Create a voting
			</Button>
			<div className="contract">
				<p> Owner of the contract is: {this.state.owner} </p>
			</div>
		</div>
		)
	}
}

export default CreateVoting