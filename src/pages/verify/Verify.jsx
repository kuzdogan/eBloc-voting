import React, { Component } from 'react'
import SmartVotingContract from '../../../build/contracts/SmartVoting.json'
import getWeb3 from '../../utils/getWeb3'
import QrReader from 'react-qr-reader'
import util	from 'ethereumjs-util'	
import { Grid, Col, ButtonToolbar, FormGroup, Jumbotron, Radio, Navbar, Nav, MenuItem, Button, Row } from 'react-bootstrap'	
const loadash = require('lodash');
const SolidityFunction = require('web3/lib/web3/function');
const EthereumTx = require('ethereumjs-tx')

class Verify extends Component{
	constructor(props){
		super(props);
		this.state = {
			web3: null,
			candidates: [],
			candidateVotes: [],
			address: '',
			smartVotingInstance: null,
			privateKey: '',
			isFirefox: false,
			isActive: false,
			hasUserVoted: false,
			hasSubmit: false
		}
		this.handleScan = this.handleScan.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.instantiateContract = this.instantiateContract.bind(this);
		this.mygetaddr = this.mygetaddr.bind(this);
		this.openImageDialog = this.openImageDialog.bind(this);		
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
			wallet: results.wallet
		  },function(){
					this.instantiateContract();		 	
		  })
		})
		.catch(() => {
		  console.log('Error finding web3.')
		})

		// Check browser for QR scanner
		// Firefox lets using webcam from non https sources
		// We can't use https because RPC calls are only available in http
		if(navigator.userAgent.indexOf("Firefox") != -1){
			// alert("Firefox");
			this.setState({isFirefox: true});
		} else{
			// alert("NOT FİREFOX");
		}
  }
	
  instantiateContract() {
  	// Check web3
	  if(this.state.web3){
	  	// Get contract instance
			const contract = require('truffle-contract')
			const smartVoting = contract(SmartVotingContract)
			smartVoting.setProvider(this.state.web3.currentProvider)

			smartVoting.deployed().then(instance => {
				this.smartVotingInstance = instance;
				return this.smartVotingInstance.numberOfElections()
			}).then(numElections => { // Arrow function for using "this"
				console.log("Number of elections so far is: " + numElections);
			}).catch( err => {
				console.log(err);
			})

			this.state.web3.eth.getAccounts((error, accounts) => {
				console.log(accounts);
			})
	  }
	  else {
		  console.log("NO WEB3");
		}
  }

	async handleSubmit() {
		var electionId = await this.smartVotingInstance.getElectionId("0x"+this.state.address);
		var isActive = await this.smartVotingInstance.isActive(electionId).then( (isActive) => isActive);
		var isVoted = await this.smartVotingInstance.isVoted('0x' + this.state.address)
			this.setState({
				hasUserVoted: isVoted
			})
		if (isActive) {
			this.setState({
				isActive: true
			})
			console.log("The election is active");
		}
		else {
			console.log("The election has ended");
			// Get candidates vote count
			var tempVotes = this.state.candidateVotes;
			for (var i = 0; i < this.state.candidates.length; i++){
				let voteCount = await this.smartVotingInstance.getVoteNumber(electionId, this.state.candidates[i].name)
				.then(voteCount=>voteCount.toString(10));
				tempVotes.push(voteCount)
			}
			this.setState({candidateVotes: tempVotes})
		}
		this.smartVotingInstance.getElectionId("0x"+this.state.address).then( (num) => {
			console.log("Election id is: " + num);
			this.smartVotingInstance.isActive(num).then( (isActive) => {
				
			})
			this.setState({ hasSubmit: true }, function(){
				console.log(this.state);
			});
		})
		console.log("Checked the Election");
		console.log(this.state);
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
		console.log('asdsad '+ err)
  }
  openImageDialog() {
    this.refs.qrReader.openImageDialog()
  }
  renderQRReader(){
  	if(this.state.isFirefox) {
  		return	<QrReader
					ref="qrReader"
					delay={this.state.delay}
					onError={this.handleError}
					onScan={this.handleScan}
					style={{width: '100%'}}
				/>;
			} else{
				return <QrReader
					ref="qrReader"
					delay={this.state.delay}
					onError={this.handleError}
					onScan={this.handleScan}
					style={{width: '100%'}}
					legacyMode
				/>;
			}
  }
	render(){		
		return(
			<div className="App">
				 <Navbar inverse collapseOnSelect>
				 	<div className="navbar-container">
				    <Navbar.Header>
				      <Navbar.Brand>
				        <a href="/">eBloc Voting</a>
				      </Navbar.Brand>
				      <Navbar.Toggle />
				    </Navbar.Header>
				    <Navbar.Collapse>
				      <Nav>
				        <MenuItem href="/create">Create Voting</MenuItem>
				        <MenuItem href="/vote">Cast Vote</MenuItem>
				        <MenuItem href="/verify">Verify Election</MenuItem>
				      </Nav>
				    </Navbar.Collapse>
				  </div>
			  </Navbar>

				<main className="container">
					<Grid>
						<Col xs={1} sm={2} lg={4}/>
						<Col xs={12} sm={8} lg={4}>
							<div style={{marginTop: '50px'}}>
								{this.renderQRReader()}
							</div>
							<div>
							{ this.state.hasSubmit && (
									this.state.isActive ? (
											<p> This election is currently active. Please check for results after the deadline passes. </p>
										) :
										( <p> This election has ended. Please check the results below </p>)
								)
							}
							<FormGroup>
								{this.state.hasSubmit && 
									(this.state.candidates.map((c,index)=>(

									<div className="vote-results">
										<Row>
											<p> {c.name}: {this.state.candidateVotes[index]} </p>
										</Row>
									</div>
									
									))
									)
								}
								{this.state.hasSubmit && (
										<Row>
											<p> Have you voted: {this.state.hasUserVoted ? 
												(<i className="fa fa-check" aria-hidden="true" style={{color: '#449D44', fontSize: '18px'}}></i>)
											: (<i className="fa fa-times" aria-hidden="true" style={{color: '#C9302C', fontSize: '18px'}}></i>)} </p>
										</Row>
								)}
										<Row>
											<p style={{fontSize: '3vw'}}> Your address is: {this.state.address} </p>
										</Row>
	
								<Row style={{margin: 0, paddingBottom: '20px', paddingTop: '20px'}}>								
									<ButtonToolbar>
										{this.state.isFirefox ? null : <Button bsStyle="primary" onClick={this.openImageDialog}>Upload QR</Button>}
										<Button bsStyle={this.state.candidates.length === 0 ? "primary" : "success"} onClick={this.handleSubmit} disabled={this.state.candidates.length === 0}>Submit</Button>
									</ButtonToolbar>
								</Row>
							</FormGroup>
							</div>
						</Col>
					</Grid>
				</main>
			</div>
		)
	}
}

export default Verify