import React, {Navbar, Nav, MenuItem, Component } from 'react'
import {Button} from 'react-bootstrap'

class VotingApp extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
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
                <MenuItem eventKey={1} href="/create">Create Voting</MenuItem>
                <MenuItem eventKey={2} href="/vote">Cast Vote</MenuItem>
                <MenuItem eventKey={2} href="/verify">Verify Election</MenuItem>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>


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