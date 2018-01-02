import React, { Component } from 'react'
import SmartVotingContract from '../../../build/contracts/SmartVoting.json'
import getWeb3 from '../../utils/getWeb3'
import QrReader from 'react-qr-reader'
import { FormGroup, Jumbotron, Radio, Navbar, Button } from 'react-bootstrap'
import util	from 'ethereumjs-util'	
var ethKeys = require("ethereumjs-keys");



class Vote extends Component{
	constructor(props){
		super(props);
		this.state = {
			web3: null,
			delay: 300,
			result: 'No result',
			candidates: [],
			address: '',
			smartVotingInstance: null,
			selectedOption: '0',
			privateKey: ''
		}
		this.handleScan = this.handleScan.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.instantiateContract = this.instantiateContract.bind(this);
		this.mygetaddr = this.mygetaddr.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
	}

	handleOptionChange(changeEvent) {
		this.setState({
		  selectedOption: changeEvent.target.value
		});
	}

	mygetaddr(prikey) {	
		var privatekey = new	Buffer(prikey,	'hex')	;	
		var publickey =	util.privateToPublic(privatekey)	
		return(util.publicToAddress(publickey).toString('hex'))	;		
	}
	componentWillMount() {
		// Get network provider and web3 instance.
		// See utils/getWeb3 for more info.
		getWeb3
		.then(results => {
		  this.setState({
			web3: results.web3,
		  },function(){
					this.instantiateContract();		 	
		  })
		})
		.catch(() => {
		  console.log('Error finding web3.')
		})
	
	  }
	
	  componentDidMount(){
	  }
	
	  instantiateContract() {
		  if(this.state.web3){
			const contract = require('truffle-contract')
			const smartVoting = contract(SmartVotingContract)
			smartVoting.setProvider(this.state.web3.currentProvider)
	
			// Declaring this for later so we can chain functions on SimpleStorage.
	
			smartVoting.deployed().then(instance => {
				this.smartVotingInstance = instance;
				return this.smartVotingInstance.numberOfElections()
			}).then(numElections => { // Arrow function for using "this"
				console.log("Number of elections so far is: " + numElections);
			})
	
			this.state.web3.eth.getAccounts((error, accounts) => {
				console.log(accounts);
			})
		  }
		  else {
			  console.log("NO WEB3");
		  }
	  }

	handleSubmit() {
		console.log('Voted')
		this.smartVotingInstance.getElectionId("0x"+this.state.address).then((num)=>{
			const candidateName = this.state.candidates[Number(this.state.selectedOption)].name;
			const electionId = Number(num.toString());
			const pwd = randomStr();
			this.state.web3.personal.importRawKey(this.state.privateKey, pwd);
			if(this.state.web3.personal.unlockAccount(this.state.address, pwd)) {
				this.smartVotingInstance.voteFor(candidateName, electionId, {gas: 1400000, from: this.state.address}
				).then((tx) => {
					console.log(tx);
				})
			}
		})
	}

	handleScan(data){
		if(data){
			const result = JSON.parse(data);
			this.setState({
				address: this.mygetaddr(result.address),
				privateKey: result.address,
				candidates: result.candidates,
				result: JSON.stringify(result)
			})

		}
	  }
	  handleError(err){
		console.log('asdsad '+err)
	  }
	render(){
		return(
			<div className="App">
				<nav className="navbar pure-menu pure-menu-horizontal">
					<a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
				</nav>

				<main className="container">
					<div style={{marginTop: '50px'}} className="row justify-content-md-center">
						<QrReader
							delay={this.state.delay}
							onError={this.handleError}
							onScan={this.handleScan}
							style={{width: '25%'}}
						/>
					</div>
					<p>{this.state.address}</p>
					<p>{this.state.result}</p>
					<div>
					<FormGroup>
						{this.state.candidates.map((c,index)=>(
							<div className="radio">
								<label>
								<input type="radio" value={""+index} 
								checked={this.state.selectedOption === (''+index)} 
								onChange={this.handleOptionChange} />
								{c.name}
								</label>
							</div>
							
						))}
						<Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.state.candidates.length === 0}>Submit</Button>
					</FormGroup>
					</div>
				</main>
			</div>
		)
	}
}


function randomStr() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < 5; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
  }
  

export default Vote