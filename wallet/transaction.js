const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
	constructor() {
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}

	update(senderWallet, recipient, amount) {
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
		if(amount > senderOutput.amount) {
			console.log(`Amount: ${amount} exceeds balance.`);
			return;
		}
		senderOutput.amount = senderOutput.amount - amount;
		this.outputs.push({ amount, address: recipient });
		Transaction.signTransaction(this, senderWallet);
		return this;
	}

	static transactionWithOutputs(senderWallet, outputs) {
		const transaction = new this();
		transaction.outputs.push(...outputs);
		Transaction.signTransaction(transaction, senderWallet);
		return transaction;
	}

	static rewardTransaction(minerWallet, blockchainWallet) {
		return Transaction.transactionWithOutputs(blockchainWallet, [{
			address: minerWallet.publicKey,
			amount: MINING_REWARD
		}]);
	}

	static newTransaction(senderWallet, recipient, amount) {	
		if(amount > senderWallet.balance) {
			console.log(`Amount: ${amount} exceeds balance.`);
			return;
		}

		return Transaction.transactionWithOutputs(senderWallet, [
		{
			amount: senderWallet.balance - amount,
			address: senderWallet.publicKey
		}, 
		{
			amount,
			address: recipient
		}
		]);
	}

	static signTransaction(transaction, senderWallet) {
		const timestamp = Date.now();
		const amount = senderWallet.balance;
		const address = senderWallet.publicKey;
		const signature = senderWallet.sign(ChainUtil.hash(transaction.outputs));
		transaction.input = {
			timestamp,
			amount,
			address,
			signature 
		}
	}

	static verifyTransaction(transaction) {
		return ChainUtil.verifySignature(transaction.input.address, transaction.input.signature, ChainUtil.hash(transaction.outputs));
	}
}

module.exports = Transaction;