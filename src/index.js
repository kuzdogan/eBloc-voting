import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css'
import VotingApp from './VotingApp'
import CreateVoting from './pages/createVoting/CreateVoting'
import Vote from './pages/vote/Vote'
import Verify from './pages/verify/Verify'

ReactDOM.render(
	<BrowserRouter>
  	<Switch>
    	<Route exact path="/" component={VotingApp} />
    	<Route exact path="/create" component={CreateVoting} />
    	<Route exact path="/vote" component={Vote} />
    	<Route exact path="/verify" component={Verify} />
  	</Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
