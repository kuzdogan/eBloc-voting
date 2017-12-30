var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SmartVoting = artifacts.require("./SmartVoting.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SmartVoting);  
};
