import React, { Component } from 'react';

class WalletInfo extends Component {
	render() {
		return (
			<div className="wallet-info">
				<h3>Wallet Information</h3>
				<p>Wallet Address: { this.props.wallet.address }</p>
				<p>Wallet Balance: { this.props.wallet.balance }</p>
			</div>
		);
	}
}

export default WalletInfo;