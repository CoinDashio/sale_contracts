var Migrations = artifacts.require("./Migrations.sol");

var coindash_company_account = web3.eth.accounts[0];

module.exports = function(deployer) {
  deployer.deploy(Migrations, {from: coindash_company_account});
};
