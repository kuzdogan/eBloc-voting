import React, { Component } from 'react'
import {Button, Form, FormGroup, FormControl, ControlLabel, Glyphicon, Grid, Row, Col} from 'react-bootstrap'
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
      voters: [{ address: ''}],
      candidates: [{ address: ''}],
      smartVotingInstance: null
    }
    this.instantiateContract = this.instantiateContract.bind(this);
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

  // Voter Handlers
  handleVoterChange = (idx) => (evt) =>{
  	const newVoters = this.state.voters.map((voter, sidx) => {
      if (idx !== sidx) return voter;
      return { ...voter, address: evt.target.value };
    });
    this.setState({ voters: newVoters });
  }
  handleAddVoter = () => {
    this.setState({ voters: this.state.voters.concat([{ address: '' }]) });
  }
  handleRemoveVoter = (idx) => () => {
    this.setState({ voters: this.state.voters.filter((v, sidx) => idx !== sidx) });
  }  

  // Candidate Handlers
  handleCandidateChange = (idx) => (evt) =>{
  	const newCandidates = this.state.candidates.map((candidate, sidx) => {
      if (idx !== sidx) return candidate;
      return { ...candidate, address: evt.target.value };
    });
    this.setState({ candidates: newCandidates });
  }
  handleAddCandidate = () => {
    this.setState({ candidates: this.state.candidates.concat([{ address: '' }]) });
  }
  handleRemoveCandidate = (idx) => () => {
    this.setState({ candidates: this.state.candidates.filter((v, sidx) => idx !== sidx) });
  }  

	render(){
		return(
		<div className="page">
			<Grid>
				<h1> Here you can create votings</h1>
				<Form>
					<FormGroup>
						<Row>
							<p> Enter voter addresses </p>	
						</Row>
						{this.state.voters.map((voter, idx) => (
		          <Row className="voter-input">
		          	<Col md={6}>
			            <FormControl
			              type="text"
			              placeholder={`Voter #${idx + 1} address`}
			              value={voter.address}
			              onChange={this.handleVoterChange(idx)}
			            />
			          </Col>
			          <Col>
			            <Button bsStyle="danger" onClick={this.handleRemoveVoter(idx)}>
			            	<Glyphicon glyph="trash"/>
		            	</Button>
	            	</Col>
		          </Row>
		        ))}
	        	<Button bsStyle="primary" onClick={this.handleAddVoter}>Add Voter</Button>
	        </FormGroup>
	        <FormGroup>
						<Row>
							<p> Enter candidate addresses </p>	
						</Row>

						{this.state.candidates.map((candidate, idx) => (
		          <Row className="voter-input">
		          	<Col md={6}>
			            <FormControl
			              type="text"
			              placeholder={`Candidate #${idx + 1} address`}
			              value={candidate.address}
			              onChange={this.handleCandidateChange(idx)}
			            />
			          </Col>
			          <Col>
			            <Button bsStyle="danger" onClick={this.handleRemoveCandidate(idx)}>
			            	<Glyphicon glyph="trash"/>
		            	</Button>
	            	</Col>
		          </Row>
		        ))}
        		<Button bsStyle="primary" onClick={this.handleAddCandidate}>Add Candidate</Button>
		      </FormGroup>
		      <FormGroup inline>
		        <Row>
	        		<ControlLabel> Select starting date and time</ControlLabel>
	        	</Row>
	        	<Row>      
		        	<Col md={6}>
								<Datetime defaultValue={new Date()}/>
		        	</Col>
						</Row>
		        <Row>
	        		<ControlLabel> Select end date and time</ControlLabel>
	        	</Row>
	        	<Row>      
		        	<Col md={6}>
								<Datetime defaultValue={new Date()}/>
		        	</Col>
						</Row>
						<Button bsStyle="primary" onClick={this.instantiateContract}>
						Create a voting
						</Button>
					</FormGroup>
				</Form>
				<div className="contract-info">
					<p> Owner of the contract is: {this.state.owner} </p>
					<h2> Voters are</h2>
						{this.state.voters.map((voter, idx) => (
		          <Row className="voter-{idx}">
		          	<p> Voter {idx}: {voter.address} </p>
		          </Row>
		        ))}
					<h2> Candidates are</h2>
						{this.state.candidates.map((candidate, idx) => (
		          <Row className="candidate-{idx}">
		          	<p> Candidate {idx}: {candidate.address} </p>
		          </Row>
		        ))}
				</div>
			</Grid>
		</div>
		)
	}
}

export default CreateVoting