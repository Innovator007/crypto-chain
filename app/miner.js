const Transaction = require('../wallet/transaction');
const wallet = require('../wallet');

class Miner {
	constructor(blockchain, transactionPool, Wallet, p2pServer) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.Wallet = Wallet;
		this.p2pServer = p2pServer;
	}

	mine() {
		// gather valid transactions
		const validTransactions = this.transactionPool.validTransactions();
		// checking if any valid transactions exist or if there's atleast one valid transaction then and then only allow miner to mine the block and add it in the blockchain
		let block;
		if(validTransactions.length > 0) {
			// include a reward for the miner
			validTransactions.push(Transaction.rewardTransaction(this.Wallet, wallet.blockchainWallet()));
			// create a block consisting of valid transactions
			block = this.blockchain.addBlock(validTransactions);
		}
		// syncronize the chains in p2p server
		this.p2pServer.syncChains();
		// clear the transaction pool 
		this.transactionPool.clear();
		//and broadcast every miner to clear their transaction pool
		this.p2pServer.broadcastClearTransactions();
		//return newly created block
		return block;
	}
}

module.exports = Miner;