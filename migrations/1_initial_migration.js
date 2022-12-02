const VerifyMe = artifacts.require("./VerifyMe.sol");

module.exports = function(deployer) {
  deployer.deploy(VerifyMe);
};