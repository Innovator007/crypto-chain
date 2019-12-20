import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Blocks from './Blocks';
import WalletInfo from './WalletInfo';

class App extends Component {
	state = {
		walletInfo: {},
		peersLength: 0
	}

	componentDidMount() {
		fetch(document.location.origin + '/api/wallet-info')
			.then(res => res.json())
			.then(res => {
				this.setState({ walletInfo: res });
			})
			.catch(e => console.log(e));
		fetch(document.location.origin + '/api/peers/connected/length')
			.then(res => res.json())
			.then(res => this.setState({ peersLength: res }))
			.catch(e => console.log(e));
	}

	render() {
		return (
			<div className="App">
				<h2 className="text-center">Welcome to CryptoChain!</h2>
				<WalletInfo wallet={this.state.walletInfo} />
				<h5 className="text-center">Connected Peers: { this.state.peersLength }</h5>
				<span className="text-center">
					<button className="button"><Link to="/blocks">View Blocks</Link></button>
					<button className="button"><Link to="/transaction/conduct">Conduct Transaction</Link></button>
					<button className="button"><Link to="/transactions/pool">View Transaction Pool</Link></button>
				</span>
			</div>
		);
	}
}

export default App;