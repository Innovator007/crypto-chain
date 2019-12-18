import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import Blocks from './components/Blocks';
import App from './components/App';
import history from './history';
import './style.css';

render(
	<Router history={history}>
		<Switch>
			<Route exact path="/" component={App} />
			<Route exact path="/blocks" component={Blocks} />
		</Switch>
	</Router>, 
document.getElementById('root'));