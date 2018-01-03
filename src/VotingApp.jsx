import React, { Component } from 'react'
import {Button} from 'react-bootstrap'

class VotingApp extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Smart Voting</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Voting App</h1>
              <p>Please select to create a voting or vote in an existing election</p>
              <Button bsStyle="primary" href="/create" style={{margin: '5px'}}> Create Election </Button>
              <Button bsStyle="primary" href="/vote" style={{margin: '5px'}}> Vote in an Election </Button>
              <Button bsStyle="primary" href="/verify" style={{margin: '5px'}}> Verify Election</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }  
}

export default VotingApp