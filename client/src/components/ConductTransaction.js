import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
	state = {
		recipient: '',
		amount: ''
	}

	handleChange = event => {
		const name = event.target.name;
		this.setState({ [name]: name==="amount" ? Number(event.target.value) : event.target.value });
	}

	handleSubmit = () => {
		const { recipient, amount } = this.state;
		if(recipient === '' || amount === '' || amount < 0) {
			if(recipient === '') {
				alert("Add Recipient Address!");
				return;
			} else {
				alert("Amount should be greater than 0!");
				return;
			}
		} else {
			fetch(document.location.origin + '/api/transact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					recipient,
					amount
				})
			})
			.then(res => res.json())
			.then(res => {
				alert("Transaction successful!");
				history.push('/transactions/pool');
			})
			.catch(e => {
				alert("There was an unexpected error, Please try again!");
			})
		}
	}

	render() {
		return (
			<div className="conduct-transaction">
				<button className="button margin-medium"><Link to="/">Home</Link></button>
				<h3 className="text-center">Conduct Transaction</h3>
				<div className="conduct-transaction-form">
					<input className="form-control" name="recipient" value={this.state.recipient} onChange={this.handleChange} type="text" placeholder="Enter Recipient Address..." />
					<Link style={{textDecoration:'underline'}} to="/knownAddresses">Known Addresses</Link>
					<input className="form-control" name="amount" value={this.state.amount} onChange={this.handleChange} type="number" placeholder="Enter Amount" />
					<button onClick={this.handleSubmit} className="button">Send</button>
				</div>
			</div>
		);
	}
}

export default ConductTransaction;