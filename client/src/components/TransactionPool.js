import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';
import history from '../history';

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
	state = {
		transactionPool: []
	}

	fetchTransactionPool = () => {
		fetch(document.location.origin + '/api/transactions')
			.then(res => res.json())
			.then(res => {
				this.setState({ transactionPool: res });
			})
			.catch(e => console.log(e));
	}

	componentDidMount() {
		this.fetchTransactionPool();
		this.pollTransactions = setInterval(() => this.fetchTransactionPool(), POLL_INTERVAL_MS);
	}

	componentWillUnmount() {
		clearInterval(this.pollTransactions);
	}

	mineTransactions = () => {
		document.getElementById('mineButton').innerHTML = 'Mining...';
		fetch(document.location.origin + '/api/mine-transactions')
			.then(res => res.json())
			.then(response => {
				alert("Mining successful!");
				history.push('/blocks')
			})
			.catch(e => console.log(e));
	}

	render() {
		return (
			<div className="transaction-pool">
				<button className="button margin-medium"><Link to="/">Home</Link></button>
				<h3 className="text-center">Transaction Pool</h3>
				{ this.state.transactionPool.map(transaction => {
					return (
						<div key={transaction.id} className="transaction-pool-item">
							<Transaction transaction={transaction} />
						</div>
					)
				}) }
				{ this.state.transactionPool.length > 0 ? 
				<button id="mineButton" onClick={this.mineTransactions} className="button margin-medium">Mine Transactions</button>
				: <h5 className="text-center">No new Transactions</h5>
				}
			</div>
		);	
	}
}

export default TransactionPool;