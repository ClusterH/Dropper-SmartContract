const Dropper = artifacts.require('Dropper');
const Collection = artifacts.require('Collection');
const BN = web3.utils.BN;

dropperMetadata = 'QmTVjBymu1YVVutvseUeJq6h8haVeETkvw9Q6YrZ6HRJHS'
collectionMetadata = 'QmWPNQz8fBmAySSBGCt5BjjBnD1DxvMvi4CWGQxCW3EF54'

commonURIs = 
 ["QmSRKPvfFkZE5j3c5kuLdUAE2agrvGXUF3m5aNk5JrTVKt",
 "QmcZRWzsF2xFDvxPpqidZiV3dKoZsR4FnuCHVHTYVcSpSX",
 "QmaFgP4isDRbSxdQMreNv3b81dj7o9F453KKPdAKJqjCwh",
 "QmZTH6mT1SbvDvWSeYvcpSPZ3exqdRaKjZDJuSRZ1GRwYR",
 "Qme3adBaJT1TXfwAJ6fWE6bV7KgNpUNBCNqDNTsD7eoi7t",
 "QmVNakY1PZo7EenCK5qhCUJosV5Jz8J7ZR1Fz6TdLCKrJN",
 "QmUEMtsvpt4KqWqGKVKCiE5J9cXMhD6f1gNDTutEH1BN7M",
 "QmPd37kTyZM2W7Tmsq8bkJFdSe4Y7efoX3peAkpi4ayHig",
 "QmSF9YTgKanDHzg1ip86YjLLi8MYt7xiFSTNrNDhjmcCu6",
 "QmdzSMbK8Ru3NWYku7EB1ixi23b8YDJZVfyAcshA7qT3Y5",
 "QmUtbTYBHPXcb4wdPqkpjqeEXt7ZZDxoSQJdBTA2n52VGP",
 "QmZN8BKjyaEefqYobvZ3kekB3sSgU9dvnbcCN1vRiYD17i",
 "QmQJYjTcdWyN1SfDtJBXY9bdV1H1cEQcuaNdPcYEqrVgjV",
 "QmPzb2DFgdxCTrsJZ2qX2KB3NF8FGdJYWr8JmS2FEBMpZr",
 "QmbpzdN1pDs9ecFS7oaQQ7mdvTXwMcz771RbLo1VZD3z58"
 ];
commonRarity = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

uncommonURIs = 
 ["QmPW9d44NyNzrB76DnX6E37cKbi2PmmvJ3MvgmpJHQDN2J",
  "QmVeEUxYTMF6sXhasBuaPm2JRpWs2vSmZUQTkkvTTgt1vr",
  "QmdTHx42Eaq3N6i3Uhsh49cqZFygBPgXryoyTY5s6wfP87",
  "QmPsLyhM4zQHFgVeYAAArcaz1JmN91ToqR44NuESArTGs4",
  "QmQJzUoVsT5N3DjmDpt8irqo4Fm9TRS3kyJmAA1wRCcU7b",
  "QmbCPdTese2eWA6x3fGzMDdnsSHDgfPwNzUmqagv93UhYH",
  "QmYwQSC3s4wuB2AHZ9bSk19R8cGB9mgQc2VF9Y3UX7UnaW",
  "QmXer9rYEwTCHTFvm2J5G5sNN8TAZm2eBuqNvuE2PecZyK",
  "QmXxcVLoC6QruGnWJSu9kvZUN7K9j1PiAdWMkLtjQakYKx"
 ];
uncommonRarity = [1,1,1,1,1,1,1,1,1]

rareURIs = 
 ["QmdSH9LVyAcA6t1KPgbobGx2FGfTU1HrBzaSHgTp8vZuwc",
  "QmQRgKj9rF6Fv1zf2S7kpiD2auGKhNN6firLPHFxcjuKqK",
  "QmWnLZ2NfrfBCg2Gt25jvvbwFzFSSN985HFzghd5sW9Btd",
  "QmYsGevurk4V9592eWwzqKRCJvunmik8cmEpA9uqQXTmQj",
  "QmNhVYgs9NtmFFpH1kFGm5xMw4p4EgdGCbHcuR9XHZJm8g"
 ];
rareRarity = [2,2,2,2,2]

epicURIs = 
 ["QmWZjsbd4afuRewC3fxiJME6tR981KgoTWqW42gnsi9CRG",
 "QmRxKbHP6Hu5QLMaq5Yemq3xv1rbn3sBquUiGqu2Ff5o6V",
 "QmaEAz1aAWyBDVXhjboaHvGrM2VpsV1nVo4jXzL2B8vds9",
 "QmQTzyFJpEXqS3VLUqpifwmjj92iiHnCfzme8V2Ba5JGfz",
 "Qmbpt5i1BSVFDdqEjFBLVjkeKQWbCGqe5nfNNr3fFkcBUz"
 ];
epicRarity = [3,3,3,3,3]

mythicURIs = 
 ["QmYUNcp8VpgedbVbT6eovQaExLEiLEfJ2qAyCB3gXx3uhp",
 "QmWo7ojnrje8h6Jjhig4GBePaRt5jCxPYYozaRUfSLFNPm",
 "QmejYbhgwVqxvFzbGd3qTYGaMwwpaHwjLhBgo9Da8fA3sZ",
 "QmTbEguS4p11V19A2MQHXnaocVphmZHiXLtFfWVCNECoas",
 "QmbJW894mSmkcoSJCh7PjnmBLknf7AUVxU9xFVLEtkzW6j"
 ];
mythicRarity = [4,4,4,4,4]


momentURIs = commonURIs.concat(uncommonURIs,rareURIs,epicURIs,mythicURIs)
momentRarity = commonRarity.concat(uncommonRarity,rareRarity,epicRarity,mythicRarity)

packURIs = 
 ["Qmdt1qVWMRYfaAxjc4yuQCPZgiTEuS3ywHrRz3WRYeDfXg",
  "QmR9ZTYKDZ3v91NkxmbR35YwqUCaqWoax6fi7MNtcVXZuh",
  "QmQuzGMNq7A1Ta4T1XiC45FBjfpVVCgSgzs9J92vvoxwKy"];

// Use BN for actual pack cost or multiply in contract
packCost = [40000000,75000000,150000000];
momentsPerPack = [3,5,7];
rarityGuarantees = [[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0]];
rarityOdds = [[5250, 3500, 1000, 240, 10],[5250, 3500, 1000, 240, 10],[5250, 3500, 1000, 240, 10]];
lockDate = Math.floor(new Date().getTime()/1000.0) + 604,800; //100,000 //Used to test time lock

module.exports = async function (deployer) {
  await deployer.deploy(Dropper, dropperMetadata);
  const dropper = await Dropper.deployed();
  await deployer.deploy(Collection, Dropper.address);
  const collection = await Collection.deployed();
  await dropper.setCollection(Collection.address);
  await collection.initializeCollection(momentURIs, momentRarity, packURIs, packCost, momentsPerPack, rarityGuarantees, rarityOdds);
};

    //.then(function() {
    //return collection = deployer.deploy(Collection, lockDate);
    //return deployer.deploy(Collection, momentURIs, momentRarity, packURIs, packCost, momentsPerPack, rarityGuarantees, rarityOdds, lockDate, Dropper.address);
  //collection = await Collection.deployed()
  //collection.initializeCollection(momentURIs, momentRarity, packURIs, packCost, momentsPerPack, rarityGuarantees, rarityOdds);

  /*
  momentStruct = {
  "momentStruct" : {
    "momentURI": 'string',
    "rarityId": 'uint256',
    "totalMinted": 'uint256'
  }
}

packStruct = {
  "packStruct" : {
    "packURI": 'string',
    "momentQuantity": 'uint256',
    "momentGuarantees": 'uint256[]'
  }
}

packs = web3.eth.abi.encodeParameters([packStruct, packStruct, packStruct],
  [{
    "packURI": "https://dropperpack1.com",
    "momentQuantity": 3,
    "momentGuarantees": [0,0,1,0,0]
  },
  {
    "packURI": "https://dropperpack2.com",
    "momentQuantity": 5,
    "momentGuarantees": [0,0,2,0,0]
  },
  {
    "packURI": "https://dropperpack3.com",
    "momentQuantity": 7,
    "momentGuarantees": [0,0,2,1,0]
  }]
)
*/
