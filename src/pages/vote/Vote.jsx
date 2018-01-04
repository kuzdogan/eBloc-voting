import React, { Component } from 'react'
import SmartVotingContract from '../../../build/contracts/SmartVoting.json'
import getWeb3 from '../../utils/getWeb3'
import QrReader from 'react-qr-reader'
import { FormGroup, Button, Grid, Row, Col, ButtonToolbar } from 'react-bootstrap'
import util	from 'ethereumjs-util';
const loadash = require('lodash');
const SolidityFunction = require('web3/lib/web3/function');
const EthereumTx = require('ethereumjs-tx')

class Vote extends Component{
	constructor(props){
		super(props);
		this.state = {
			web3: null,
			wallet: null,
			delay: 300,
			result: 'No result',
			candidates: [],
			address: '',
			smartVotingInstance: null,
			selectedOption: '0',
			privateKey: '',
			isFirefox: false
		}
		this.handleScan = this.handleScan.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.instantiateContract = this.instantiateContract.bind(this);
		this.mygetaddr = this.mygetaddr.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.openImageDialog = this.openImageDialog.bind(this);
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
			// alert("NOT FIREFOX");
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
		console.log('asdas',this.state.wallet)
  }

	handleSubmit() {
		console.log(this.state.privateKey, this.state.address);
		this.smartVotingInstance.getElectionId("0x"+this.state.address).then( (num) => {
			const candidateName = this.state.candidates[Number(this.state.selectedOption)].name;
			const electionId = Number(num.toString());
			var ABI = SmartVotingContract.abi;
			var functionDef = new SolidityFunction('', loadash.find(ABI, { name: 'voteFor' }), '');
			var payloadData = functionDef.toPayload([candidateName,electionId]).data;
			const privateKey = Buffer.from(this.state.privateKey, 'hex')
			const gasprice = this.state.web3.toHex(this.state.web3.eth.gasPrice);	
			const latestblock = this.state.web3.eth.getBlock("latest");	
			const gaslimit = this.state.web3.toHex(80000);
			const nonce =	this.state.web3.eth.getTransactionCount('0x'+this.state.address);
			const txParams = {
				nonce,
				gasPrice: gasprice,
				gasLimit: gaslimit,
				to: '0xfa57880a745ea99992b19e3bb362564d6c113bbd', // Contract address
				value: '0x00',
				data: payloadData
			}
			const tx = new EthereumTx(txParams)
			tx.sign(privateKey)
			const serializedTx = tx.serialize().toString('hex');
			console.log(serializedTx);
			this.state.web3.eth.sendRawTransaction('0x'+serializedTx,function(err,result){
				console.log(err,result);
				if(err) {
					console.log(err);
				} else {
	
					console.log(result);
				}
			});
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
				<nav className="navbar pure-menu pure-menu-horizontal">
					<a href="/" className="pure-menu-heading pure-menu-link">eBloc Voting System</a>
				</nav>

				<main className="container">
					<Grid>
						<Col xs={1} sm={2} lg={4}/>
						<Col xs={12} sm={8} lg={4}>
							<div style={{marginTop: '50px'}}>
								{this.renderQRReader()}
							</div>
							<div>
							<FormGroup>
								{this.state.candidates.map((c,index)=>(
									<div>
										<Col xs={14} sm={12} lg={14}>
											<div className="radio">
												<label>
												<input type="radio" value={""+index} 
												checked={this.state.selectedOption === (''+index)} 
												onChange={this.handleOptionChange} />
												{c.name}
												</label>
											</div>
										</Col>
									</div>
								))}
								<Row style={{margin: 0, paddingBottom: '20px', paddingTop: '20px'}}>
									<ButtonToolbar>
										{this.state.isFirefox ? null : <Button bsStyle="primary" onClick={this.openImageDialog}>Upload QR</Button>}
										<Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.state.candidates.length === 0}>Submit</Button>
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

// Not used
function randomStr() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < 5; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

export default Vote