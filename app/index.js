const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../Blockchain');
const P2pServer = require('./p2p-server');
const wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
const path = require('path');
const fs = require('fs');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const BACKUP_PATH = path.join(__dirname, "../backup/blockchain.json");

const app = express();
const blockchain = new Blockchain();
const Wallet = new wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain, tp);
const miner = new Miner(blockchain, tp, Wallet, p2pServer);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

//removeBackupFile();

try {
	if (fs.existsSync(BACKUP_PATH)) {
		console.log("Backup file exists, retrieving chain...");
		let rawdata = fs.readFileSync(BACKUP_PATH);
		const chain = JSON.parse(rawdata);
		blockchain.replaceChain(chain.chain);
	} else {
		backupBlockchain(blockchain.chain, true);
	}
} catch(err) {
	console.error(err);
}

async function removeBackupFile() {
	await fs.unlinkSync(BACKUP_PATH);
}

function backupBlockchain(chain, createFile=false) {
	let backup_data = JSON.stringify({
		"chain": chain
	}, null, 2);
	console.log("Backing up the blockchain!");
	fs.writeFileSync(BACKUP_PATH, backup_data, function (err, file) {
  		if (err) throw err;
  		console.log(file);
	}); 
	console.log("Backup succesfull!");
}

app.get('/api/blocks', (req, res) => {
	res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req,res) => {
	res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req,res) => {
	const { id } = req.params;
	const { length } = blockchain.chain;
	const blocksReversed = blockchain.chain.slice().reverse();
	var startIndex = (id-1)*5;
	var endIndex = id*5;
	startIndex = startIndex < length ? startIndex : length;
	endIndex = endIndex < length ? endIndex : length;
	res.json(blocksReversed.slice(startIndex, endIndex));
});

app.get('/api/block/:hash', (req, res) => {
	const block = blockchain.chain.filter(block => {
		return block.hash === req.params.hash;
	});
	if(block.length > 0) {
		res.json(block[0]);
	} else {
		res.json({});
	}
});

app.get('/api/peers/connected', (req, res) => {
    res.json(p2pServer.connectedPeers());
});

app.get("/api/peers/connected/length", (req, res) => {
	res.json(p2pServer.connectedPeersLength());
});

app.get('/api/transactions', (req,res) => {
	res.json(tp.transactions);
});

app.get('/api/wallet-info', (req,res) => {
	res.json({ balance: Wallet.calculateBalance(blockchain), address: Wallet.publicKey });
});

app.get('/api/mine-transactions', async (req,res) => {
	const block = miner.mine();
	if(block) {
		console.log(`New Block has been added: ${block.toString()}`);
		await backupBlockchain(blockchain.chain);
		res.redirect('/api/blocks');
	} else {
		console.log("No new transactions to mine.");
		res.redirect('/api/blocks');
	}
});

app.get('/api/public-key', (req,res) => {
	res.json({ publicKey: Wallet.publicKey });
});

app.post('/api/transact', (req,res) => {
	const { recipient, amount } = req.body;
	const transaction = Wallet.createTransaction(recipient, amount, blockchain, tp);
	p2pServer.broadcastTransaction(transaction);
	res.redirect('/api/transactions');
});

app.get('/api/known-addresses', (req,res) => {
	var addressMap = {};
	blockchain.chain.forEach(block => {
		if(block.data.length > 0) {
			block.data.forEach(transaction => {
				transaction.outputs.forEach(output => {
					addressMap[output.address] = output.address;
				});
			});
		}
	});
	res.json(Object.keys(addressMap));
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname,'../client/dist/index.html'));
});

app.listen(HTTP_PORT,() => {
	console.log(`Listening for connections on port: ${HTTP_PORT}`);
});

p2pServer.listen();


