const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../Blockchain');
const P2pServer = require('./p2p-server');
const wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const Wallet = new wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain, tp);
const miner = new Miner(blockchain, tp, Wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
	res.json(blockchain.chain);
});

app.get('/transactions', (req,res) => {
	res.json(tp.transactions);
});

app.get('/balance', (req,res) => {
	res.json({ balance: Wallet.calculateBalance(blockchain), publicKey: Wallet.publicKey });
});

app.get('/mine-transactions', (req,res) => {
	const block = miner.mine();
	if(block) {
		console.log(`New Block has been added: ${block.toString()}`);
		res.redirect('/blocks');
	} else {
		console.log("No new transactions to mine.");
		res.redirect('/blocks');
	}
});

app.get('/public-key', (req,res) => {
	res.json({ publicKey: Wallet.publicKey });
});

app.post('/mine', (req,res) => {
	const block = blockchain.addBlock(req.body.data);
	console.log(`New Block added: ${block.toString()}`);

	p2pServer.syncChains();

	res.redirect('/blocks');
});

app.post('/transact', (req,res) => {
	const { recipient, amount } = req.body;
	const transaction = Wallet.createTransaction(recipient, amount, blockchain, tp);
	p2pServer.broadcastTransaction(transaction);
	res.redirect('/transactions');
});

app.listen(HTTP_PORT,() => {
	console.log(`Listening for connections on port: ${HTTP_PORT}`);
});

p2pServer.listen();


