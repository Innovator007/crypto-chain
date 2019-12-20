import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';

class Blocks extends Component {
	state = {
		blocks: [],
		paginatedId: 1,
		blocksLength: 0
	}

	componentDidMount() {
		fetch(document.location.origin + '/api/blocks/length')
			.then(res => res.json())
			.then(res => this.setState({ blocksLength: res }))
			.catch(e => console.log(e));
		this.fetchPaginatedBlocks(this.state.paginatedId);
	}

	fetchPaginatedBlocks = (paginatedId) => {
		fetch(document.location.origin + '/api/blocks/' + paginatedId)
			.then(res => res.json())
			.then(res => this.setState({ blocks: res }))
			.catch(e => console.log(e));
	}

	renderPagination = () => {
		return [...Array(Math.ceil(this.state.blocksLength/5)).keys()].map(key => {
			const pagination = key + 1;
			return (
				<button className={`button paginationButton ${pagination === this.state.paginatedId ? "active" : ""}`} key={key} onClick={() => this.handlePagination(pagination)}>{pagination}</button>
			);
		});
	}

	handlePagination = (paginatedId) => {
		this.setState({ paginatedId });
		this.fetchPaginatedBlocks(paginatedId);
	}

	render() {
		return (
			<div>
				<button className="button margin-medium"><Link to="/">Home</Link></button>
				<h3 className="text-center">Blocks</h3>
				{ this.state.blocks.map(block => {
					return (
						<Block key={block.hash + Math.random()} block={block} />
					)	
				}) }
				<div className="text-center">{ this.renderPagination() }</div>
			</div>
		);
	}
}

export default Blocks;