import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class KnownAddresses extends Component {
	state = {
		knownAddresses: []
	}

	componentDidMount() {
		fetch(document.location.origin + '/api/known-addresses')
			.then(res => res.json())
			.then(res => {
				this.setState({ knownAddresses: res });
			})
			.catch(e => console.log(e));
	}

	renderKnownAddresses = () => {
		if(this.state.knownAddresses.length > 0) {
			return this.state.knownAddresses.map(address => {
				return (
					<div className="text-center" key={address}>
						<p>{address}</p>
					</div>	
				);
			})
		} else {
			return (
				<div className="text-center">
					No Known Addresses for now...
				</div>
			);
		}
	}

	render() {
		return (
			<div className="known-addresses">
				<button className="button margin-medium"><Link to="/transaction/conduct">Back</Link></button>
				<h3 className="text-center">Known Addresses</h3>
				{this.renderKnownAddresses()}
			</div>
		);
	}
}

export default KnownAddresses;