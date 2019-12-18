import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';

class Blocks extends Component {
	state = {
		blocks: []
	}

	componentDidMount() {
		fetch('/api/blocks')
			.then(res => res.json())
			.then(res => this.setState({ blocks: res }))
			.catch(e => console.log(e));
	}

	render() {
		console.log(this.state.blocks);
		return (
			<div>
				<button className="button margin-medium"><Link to="/">Home</Link></button>
				<h3 className="text-center">Blocks</h3>
				{ this.state.blocks.map(block => {
					return (
						<Block key={block.hash} block={block} />
					)	
				}) }
			</div>
		);
	}
}

export default Blocks;