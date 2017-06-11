var Migrations = artifacts.require("./Migrations.sol");

var coindash_company_account = '0x003BF8c0F98543a36D5f39Fd3EFE9bA2d4D294ec';

module.exports = function(deployer) {
  deployer.deploy(Migrations, {from: coindash_company_account});
};
