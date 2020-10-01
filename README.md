# crypto-chain - A cryptocurrency
A Bitcoin type cryptocurrency made using Blockchain.

### To setup locally:
Open Terminal and paste in the following commands

```
git clone https://github.com/Innovator007/crypto-chain.git
cd crypto-chain/
npm install 
npm run test
```
After running all these commands on your machine blockchain can be created by running the development server:

Make sure you have nodemon installed if not install it by the following command:

```
npm install -g nodemon
```
Then run the following command to run the development http server on port 3001 and peer-to-peer server on port 5001

```
npm run dev
```
Now to test that the blockchain works perfectly and it synchronizes among different peers and follow the concept of decentralized applications.

Open up another terminal and now you have to set environment variables for this terminal and add following command in your terminal:

```
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
```

#### HTTP_PORT
It can be any other than the 3001

#### P2P_PORT
It can also be any other than 5001

#### PEERS
This defines all the peers you want to connect and it is of form ws://[localhost or ip]:P2P_PORT[,ws://[localhost or IP]:P2P_PORT]

###### You can now open as many terminals you want and follow the above procedure.


### /blocks route: GET Request
Returns all the blocks in the chain.

### /transactions route: GET Request
Returns all the transactions in the transaction pool which are unconfirmed and can only be confirmed after mining in which they are removed from the transaction pool.

### /public-key route: GET Request
Returns the public-key or public-address of the user.

### /balance route: GET Request
Returns the balance and public-key of the user.

### /transact route: POST Request
Data to be sent in json form:
- recipient: public-key or public-address of the reciever
- amount: amount to be sent to the reciever

It adds the transaction in the transaction pool and synchronizes the transactions among its peers.

### /mine-transactions route: GET Request
This is the most powerful and uses compulational resources to mine the transactions and make them confirmed and add in the block in the blockchain


> Test all these routes via POSTMAN or any other http request maker like POSTMAN.
