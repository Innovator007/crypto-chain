const Block = require('./Block');

describe('Block', () => {
	let data, previousBlock, block;

	beforeEach(() => {
		data = "bar";
		previousBlock = Block.genesis();
		block = Block.mineBlock(previousBlock, data);
	});

	it('sets the `data` to match the input', () => {
		expect(block.data).toEqual(data);
	});

	it('sets the `previousHash` to match the hash of the previous block', () => {
		expect(block.previousHash).toEqual(previousBlock.hash);
	});

	it('generates the hash that matches the difficulty', () => {
		expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
	});

	it('lowers the difficulty for slowly mined blocks', () => {
		expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
	});

	it('raises the difficulty for quickly mined blocks', () => {
		expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
	});
});