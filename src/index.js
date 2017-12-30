import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './App'
import VotingApp from './VotingApp'
import CreateVoting from './pages/createVoting/CreateVoting'
import Vote from './pages/vote/Vote'

ReactDOM.render(
	<BrowserRouter>
  	<Switch>
    	<Route exact path="/" component={VotingApp} />
    	<Route exact path="/create" component={CreateVoting} />
    	<Route exact path="/vote" component={Vote} />
  	</Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
