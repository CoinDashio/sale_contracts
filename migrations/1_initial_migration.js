var Migrations = artifacts.require("./Migrations.sol");

var coindash_company_account = '0x0046c77E711Afa86ac71889BC3Ff4bCEBcb8CC7F';

module.exports = function(deployer) {
  deployer.deploy(Migrations, {from: coindash_company_account});
};
