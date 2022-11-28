const VerifyMe = artifacts.require('VerifyMe');
module.exports = function (deployer) {
  deployer.deploy(VerifyMe);
};