import React, { Component } from 'react';

class Transaction extends Component {
	render() {
		const { input, outputs } = this.props.transaction;
		return (
			<div className="block-transaction">
				<div>
					From: { input.address.substring(0, 20) }... | Balance: {input.amount}
				</div>
				<div>
					{ outputs.map(recipient => {
						return (
							<div key={recipient.address}>
								To: { recipient.address.substring(0,20) }... | Sent: { recipient.amount }
							</div>
						)
					}) }
				</div>
			</div>
		);
	}
}

export default Transaction;