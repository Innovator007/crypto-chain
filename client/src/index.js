import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import Blocks from './components/Blocks';
import App from './components/App';
import ConductTransaction from './components/ConductTransaction';
import KnownAddresses from './components/KnownAddresses';
import TransactionPool from './components/TransactionPool';
import history from './history';
import './style.css';

render(
	<Router history={history}>
		<Switch>
			<Route exact path="/" component={App} />
			<Route exact path="/blocks" component={Blocks} />
			<Route exact path="/transaction/conduct" component={ConductTransaction} />
			<Route exact path="/transactions/pool" component={TransactionPool} />
			<Route exact path="/knownAddresses" component={KnownAddresses} />
		</Switch> 
	</Router>, 
document.getElementById('root'));