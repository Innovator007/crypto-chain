const wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../Blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
	let Wallet, tp, bc;

	beforeEach(() => {
		bc = new Blockchain();
		Wallet = new wallet();
		tp = new TransactionPool();
	});

	describe('creating a transaction', () => {
		let transaction, sendAmount, recipient;

		beforeEach(() => {
			sendAmount = 20;
			recipient = 'r4nd0m-4ddr355';
			transaction = Wallet.createTransaction(recipient, sendAmount, bc, tp);
		});

		describe('and doing the same transaction', () => {
			beforeEach(() => {
				Wallet.createTransaction(recipient, sendAmount, bc, tp);
			});

			it('doubles the send `amount` subtracted from the wallet balance', () => {
				expect(transaction.outputs.find(output => output.address === Wallet.publicKey).amount).toEqual(Wallet.balance - (sendAmount*2))
			});

			it('clones the `sendAmount` output for the recipient', () => {
				expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
			});
		});
	});

	describe('calculating the balance', () => {
		let addBalance, repeatAdd, senderWallet;

		beforeEach(() => {
			senderWallet = new wallet();
			addBalance = 10;
			repeatAdd = 3;
			for(let i=0;i<repeatAdd;i++) {
				senderWallet.createTransaction(Wallet.publicKey, addBalance, bc, tp);
			}
			bc.addBlock(tp.transactions);
		});

		it('calculates the balance for the blockchain transactions matching the recipient', () => {
			expect(Wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
		});

		it('calculates the balance for the blockchain transactions matching the sender', () => {
			expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
		});

		describe('and the recipient now conducts a transaction', () => {
			let subtractBalance, recipientBalance;

			beforeEach(() => {
				tp.clear();
				subtractBalance = 15;
				recipientBalance = Wallet.calculateBalance(bc);
				Wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
				bc.addBlock(tp.transactions);
			});

			describe('senders sends a another transaction to the recipient', () => {
				beforeEach(() => {
					tp.clear();
					senderWallet.createTransaction(Wallet.publicKey, addBalance, bc, tp);
					bc.addBlock(tp.transactions);
				});

				it('calculates recipient balance only using transactions since its most recent one', () => {
					expect(Wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
				});
			});
		});
	});	
});