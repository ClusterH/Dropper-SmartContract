require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
//const mnemonic = fs.readFileSync(".secret").toString().trim();
const mnemonic = process.env.MNEMONIC
const infuraKey = process.env.INFURAKEY
const fromAddress = process.env.FROMADDRESS
const etherscanKey = process.env.ETHERSCANKEY
const polygonscanKey = process.env.POLYGONSCANKEY
const arbProviderUrl = 'http://localhost:8547/'

module.exports = {
  plugins: [
    "truffle-contract-size",
    'truffle-plugin-verify'
  ],
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    matic: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          'https://polygon-mainnet.g.alchemy.com/v2/DfEiVutLtFVvvTZnfIzpU2AG38ODcaVf'),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: fromAddress,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `wss://rinkeby.infura.io/ws/v3/${infuraKey}`
        ),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: fromAddress,
    },
    mumbai: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://polygon-mumbai.g.alchemy.com/v2/qMgMczZuXG71yJy9a16t3UrvNTFMQk8d`
          // `https://polygon-mumbai.infura.io/v3/${infuraKey}`
          // `https://speedy-nodes-nyc.moralis.io/9640ff4c41285b3f8833ee7d/polygon/mumbai`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: fromAddress,
    },
    arbitrum: {
      provider: function () {
        return wrapProvider(
          new HDWalletProvider(mnemonic, 'http://127.0.0.1:8547/')
        )
      },
      network_id: '*', // Match any network id
      gasPrice: 0,
    },
    remote_arbitrum: {
      provider: function () {
        return wrapProvider(
          new HDWalletProvider(mnemonic, 'https://kovan5.arbitrum.io/rpc')
        )
      },
      network_id: '*', // Match any network id
      gasPrice: 0,
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.7"    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  api_keys: {
    etherscan: etherscanKey,
    polygonscan: polygonscanKey
  }
};
