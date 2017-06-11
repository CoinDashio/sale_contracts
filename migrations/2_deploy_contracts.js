var Contribution = artifacts.require("./Contribution.sol")
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")

var privstarttime = web3.eth.getBlock('latest').timestamp;
var pubstartTime = privstarttime + 3600;

var coindash_company_account = '0x003BF8c0F98543a36D5f39Fd3EFE9bA2d4D294ec';
var signers = [coindash_company_account, '0x006D7bB57f664BaCD12736672FB05FD5AB4677Ae', '0x001Babe793665324BB66d6651f7abAb41C7e685A'];

module.exports = function(deployer) {

  console.log("\nDeployment:\nPrivate Start Time: " + privstarttime + "\nPublic Start Time " + pubstartTime);

  deployer.deploy(CDTMultiSigWallet, signers, 2, {from: coindash_company_account})
	.then(function() {
	  return deployer.deploy(Contribution,
	  	CDTMultiSigWallet.address,
	  	coindash_company_account,
	  	pubstartTime,
	  	privstarttime, {from: coindash_company_account});
	})  
};

