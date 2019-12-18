import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Blocks from './Blocks';
import WalletInfo from './WalletInfo';

class App extends Component {
	state = {
		walletInfo: {}
	}

	componentDidMount() {
		fetch('/api/wallet-info')
			.then(res => res.json())
			.then(res => {
				this.setState({ walletInfo: res });
			})
			.catch(e => console.log(e));
	}

	render() {
		return (
			<div className="App">
				<h2 className="text-center">Welcome to CryptoChain!</h2>
				<WalletInfo wallet={this.state.walletInfo} />
				<span className="text-center">
				<button className="button"><Link to="/blocks">View Blocks</Link></button>
				</span>
			</div>
		);
	}
}

export default App;