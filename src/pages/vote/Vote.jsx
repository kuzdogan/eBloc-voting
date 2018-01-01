import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { FormGroup, Jumbotron, Radio, Navbar, Button } from 'react-bootstrap'
var ethKeys = require("ethereumjs-keys");
 


class Vote extends Component{
	constructor(props){
		super(props);
		this.state = {
			delay: 300,
			result: 'No result',
			candidates: [],
			address: ''
		}
		this.handleScan = this.handleScan.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		console.log('Voted')
	}

	handleScan(data){
		if(data){
			const result = JSON.parse(data);
			this.setState({
				address: result.address,
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
						{this.state.candidates.map((c)=>(
							<Radio name="radioGroup">{c.name}</Radio>
						))}
						<Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.state.candidates.length === 0}>Submit</Button>
					</FormGroup>
					</div>
				</main>
			</div>
		)
	}
}


export default Vote