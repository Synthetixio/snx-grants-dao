const HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "lyrics various math speak almost tonight license crash whisper flush gossip knee";

module.exports = {
  networks: {
    dev: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
    },
    ropsten: {
      provider: () =>
      new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/4c85724d14d44bd0a579811c1e467d38"),
      network_id: 3
    },

    main: {
      provider: () =>
      new HDWalletProvider(mnemonic, "https://infura.io/v3/4c85724d14d44bd0a579811c1e467d38"),
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "0.5.13",
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "byzantium"
      }
    }
  }
}
