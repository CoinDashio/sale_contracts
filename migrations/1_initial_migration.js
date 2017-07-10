var Migrations = artifacts.require("./Migrations.sol");

var coindash_company_account = '0xA869b2674914Ec42b66daFE65acaC797CD241CBA';

module.exports = function(deployer) {
  deployer.deploy(Migrations, {from: coindash_company_account});
};
