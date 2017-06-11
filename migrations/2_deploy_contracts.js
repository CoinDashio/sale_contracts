var Contribution = artifacts.require("./Contribution.sol")
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")

var pubstartTime = web3.eth.getBlock('latest').timestamp;

var coindash_company_account = web3.eth.accounts[0];
var signers = [coindash_company_account, '0x006D7bB57f664BaCD12736672FB05FD5AB4677Ae', '0x001Babe793665324BB66d6651f7abAb41C7e685A'];

module.exports = function(deployer) {

  console.log("\nDeployment:\nPublic Start Time " + pubstartTime);

  deployer.deploy(CDTMultiSigWallet, signers, 2, {from: coindash_company_account})
	.then(function() {
	  return deployer.deploy(Contribution,
	  	CDTMultiSigWallet.address,
	  	coindash_company_account,
	  	pubstartTime,
	  	{from: coindash_company_account});
	})  
};

