module.exports = {
  networks: {
    "live": {
      network_id: 23422,
      gas: 3000000,
      host: "127.0.0.1",
      port: 8545   // Different than the default below
    },
    development: {
	   host: "localhost",
	   port: 9545,
	   network_id: "*" // Match any network id
	}
  },
  rpc: {
    host: "127.0.0.1",
    port: 8545
  }
};