const Moments = artifacts.require('Moments');
const Collection = artifacts.require('Collection');

const momentStruct = {
    "ParentStruct": {
        "rarityId": 'uint256',
        "momentURI": 'uint256',
        "totalMinted": 'uint256'
    }
}

var momentsStruct = web3.eth.abi.encodeParameters([momentStruct, momentStruct],
    [{
        "rarityId": 1,
        "momentURI": 1111,
        "totalMinted": 0
    },
    {
        "rarityId": 2,
        "momentURI": 2222,
        "totalMinted": 0
    }]
);

//console.log(momentsStruct);
//console.log(web3.eth.abi.decodeParameters([momentStruct, momentStruct], momentsStruct));

module.exports = async function main (callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);

        const Collection = artifacts.require('Collection');
        const collection = await Collection.deployed();

        //rarityOdds = web3.eth.abi.encodeParameter('uint256[]', ['5500', '3000', '1000', '450', '50']);
        rarityOdds = collection.constructor
        console.log(rarityOdds);


        //const balances = await collection.balanceOfBatch([accounts[0],accounts[0],accounts[0],accounts[0],accounts[0]], [0,1,2,3,4]);
        //console.log(balances.toString());

        //const uri = await collection.uri (2);
        //console.log(uri);

        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
};