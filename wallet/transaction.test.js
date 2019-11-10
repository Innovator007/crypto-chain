const Transaction = require('./transaction');
const { MINING_REWARD } = require('../config');
const wallet = require('./index');

describe('Transaction', () => {
	let transaction, Wallet, recipient, amount;
	beforeEach(() => {
		Wallet = new wallet();
		amount = 20;
		recipient = 'r3c1p13nt';
		transaction = Transaction.newTransaction(Wallet, recipient, amount);
	});

	it('outputs the `amount` subtracted from the wallet balance', () => {
		expect(transaction.outputs.find(output => output.address === Wallet.publicKey).amount).toEqual(Wallet.balance - amount);
	});

	it('outputs the `amount` added to the recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	});

	it('inputs the `balance` of the wallet', () => {
		expect(transaction.input.amount).toEqual(Wallet.balance);
	});

	it('validates a valid transaction',() => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	});

	it('invalidates a corrupt transaction',() => {
		transaction.outputs[0].amount = 50000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
	});

	describe('transaction the `amount` that exceeds the balance', () => {
		beforeEach(() => {
			amount = 50000;
			transaction = Transaction.newTransaction(Wallet, recipient, amount);
		});

		it('does not create the transaction', () => {
			expect(transaction).toEqual(undefined);
		})
	});

	describe('updating a transaction', () => {
		let nextAmount, nextRecipient;
		beforeEach(() => {
			nextAmount = 10;
			nextRecipient = 'n3xt-4ddr355';
			transaction = transaction.update(Wallet, nextRecipient, nextAmount);
		});

		it('subtracts nextAmount from senders output', () => {
			expect(transaction.outputs.find(output => output.address === Wallet.publicKey).amount).toEqual(Wallet.balance - amount - nextAmount);
		});

		it('outputs an amount for nextRecipient', () => {
			expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
		});
	});

	describe('creating a reward transaction', () => {
		beforeEach(() => {
			transaction = Transaction.rewardTransaction(Wallet, wallet.blockchainWallet());
		});

		it(`reward the 'miners' wallet`, () => {
			expect(transaction.outputs.find(output => output.address === Wallet.publicKey).amount).toEqual(MINING_REWARD);
		});
	});
});