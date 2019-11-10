const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const wallet = require('./index');
const Blockchain = require('../Blockchain');

describe('TransactionPool', () => {
	let tp, Wallet, transaction, bc;

	beforeEach(() => {
		bc = new Blockchain();
		tp = new TransactionPool();
		Wallet = new wallet();
		transaction = Wallet.createTransaction('r4nd-4dr355', 10, bc, tp);
	});

	it('adds a transaction to the pool', () => {
		expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
	});

	it('updates a transaction in the pool', () => {
		const oldTransaction = JSON.stringify(transaction);
		const newTransaction = transaction.update(Wallet, 'foo-4ddr355', 20);
		tp.updateOrAddTransaction(newTransaction);
		expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
	});

	it('clears transaction', () => {
		tp.clear();
		expect(tp.transactions).toEqual([]);
	});

	describe('mixing valid and corrupt transactions', () => {
		let validTransactions;

		beforeEach(() => {
			validTransactions = [...tp.transactions];
			for(let i=0;i<6;i++) {
				Wallet = new wallet();
				transaction = Wallet.createTransaction('r4nd-4dr355', 10, bc, tp);
				if(i%2===0) {
					transaction.input.amount = 999;
				} else {
					validTransactions.push(transaction);
				}
			}
		});

		it('shows a difference between valid and corrupt transactions', () => {
			expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
		});

		it('grabs valid transactions', () => {
			expect(tp.validTransactions()).toEqual(validTransactions);
		});
	});
});