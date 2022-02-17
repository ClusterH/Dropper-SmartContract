# smart-contract
These smart contracts govern the functionality of the Dropper NFTs. 


## File Structure
Dropper.sol acts as the storage contract, maintaining the balances and NFT data for all the moments created through Dropper.  
Collection.sol is an instance of a collection of moments, grouped together by a theme or creator. It has the logic for buying packs and opening packs, randomly selecting moments from those included in the collection across the different rarities.


## Running

Truffle is the dev ecosystem used. Clone the repo onto your system. Ensure Node and truffle are installed. Use npm install to install the dependnecies. For dev-net, truffle is configured to deploy to ganache. We used ganache-cli for simplicity. Truffle compile, Truffle deploy, Truffle test will all default to dev-net as well as running the test suite.
