const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
	constructor(timestamp, previousHash, hash, data, nonce, difficulty) {
		this.timestamp = timestamp;
		this.previousHash = previousHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}

	toString() {
		return `Block -
	Timestamp     : ${this.timestamp}
	Previous Hash : ${this.previousHash.substring(0,20)}
	Hash          : ${this.hash.substring(0,20)}
	Nonce         : ${this.nonce}
	Difficulty    : ${this.difficulty}
	Data          : ${this.data}
	`;
	}

	static genesis() {
		return new this('Genesis Timestamp', Date.now(), 'f1r57-h45h', [], 0, DIFFICULTY);
	}

	static mineBlock(previousBlock, data) {
		let hash, timestamp;
		const previousHash = previousBlock.hash;
		let { difficulty } = previousBlock;

		let nonce = 0;
		//proof-of-work system
		do {
			nonce++;
			timestamp = Date.now();
			difficulty = Block.adjustDifficulty(previousBlock, timestamp);
			hash = Block.hash(timestamp, previousHash, data, nonce, difficulty);
		} while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));
		
		return new this(timestamp, previousHash, hash, data, nonce, difficulty);
	}

	static hash(timestamp, previousHash, data, nonce, difficulty) {
		return ChainUtil.hash(`${timestamp}${previousHash}${data}${nonce}${difficulty}`);
	}

	static blockHash(block) {
		const { timestamp, previousHash, data, nonce, difficulty } = block;
		return Block.hash(timestamp, previousHash, data, nonce, difficulty);
	}

	static adjustDifficulty(previousBlock, currentTime) {
		let { difficulty } = previousBlock;
		difficulty = previousBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
		return difficulty;
	}
}

module.exports = Block;