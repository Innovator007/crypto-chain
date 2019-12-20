import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';

class Block extends Component {
	state = {
		displayTransaction: false
	}

	toggleTransaction = () => {
		this.setState({ displayTransaction: !this.state.displayTransaction });
	}

	renderTransaction = () => {
		const { timestamp, hash, data } = this.props.block;
		const stringifiedData = JSON.stringify(data);
		const dataToDisplay = stringifiedData.length > 35 ? stringifiedData.substring(0, 35) + "..." : stringifiedData;
		
		if(this.state.displayTransaction && data.length > 0) {
			return data.map(el => {
				return (
					<Transaction key={el.id} transaction={el} />
				);
			});
		} else {
			return (
				<p>Data: {dataToDisplay}</p>
			);
		}
	}

	render() {
		const { timestamp, hash, data } = this.props.block;
		const hashDisplay = hash.length > 15 ? hash.substring(0,15) + "..." : hash;
		return (
			<div className="block" key={hash}>
				<p>Hash: {hashDisplay}</p>
				<p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
				{ this.renderTransaction() }
				<button onClick={this.toggleTransaction} className="button read-more-button">{ this.state.displayTransaction ? "Show Less" : "Show More" }</button>
				<button className="button"><Link to={"/block/" + hash}>View Block</Link></button>
			</div>
		);
	}
}

export default Block;