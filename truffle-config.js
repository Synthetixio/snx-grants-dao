module.exports = {
  networks: {
    dev: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
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
