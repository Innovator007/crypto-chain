import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';
import history from '../history';

class ViewBlock extends Component {
	state = {
		block: {}
	}

	componentDidMount() {
		fetch(document.location.origin + '/api/block/' + this.props.match.params.hash)
			.then(res => res.json())
			.then(res => {
				if(JSON.stringify(res) === "{}") {
					alert("Block Not Available");
					history.push('/blocks');
				} else {
					this.setState({ block: res })
				}
			})
			.catch(e => console.log(e));
	}

	displayTransaction = (transaction) => {
		if(transaction.length > 0) {
			return transaction.map(el => {
				return (
					<Transaction key={el.id} transaction={el} />
				);
			});
		} else {
			return <span>No Data in block</span>
		}
	}

	renderBlockData = () => {
		const { block } = this.state;
		if(JSON.stringify(block) === "{}") {
			return (
				<p className="text-center">Loading Block, please wait...</p>
			);
		} else {
			return (
				<React.Fragment>
					<h3 className="text-center">Block #{ block.index }</h3>
					<p>Hash: {block.hash}</p>
					<p>Previous Block Hash: {block.previousHash}</p>
					<p>Nonce: {block.nonce}</p>
					<p>Difficulty: { block.difficulty }</p>
					<p>Timestamp: { new Date(block.timestamp).toLocaleString() }</p>
					<p>Data: { this.displayTransaction(block.data) }</p>
				</React.Fragment>
			);
		}
	}

	render() {
		return (
			<React.Fragment>
				<button className="button margin-medium"><Link to="/blocks">Back to All Blocks</Link></button>
				<div className="view-block">
					{ this.renderBlockData() }
				</div>
			</React.Fragment>
		);
	}
}

export default ViewBlock;