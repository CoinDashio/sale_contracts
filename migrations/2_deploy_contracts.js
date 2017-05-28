var Contribution = artifacts.require("./Contribution.sol")
// var GupToken = artifacts.require("./GUPToken.sol")
var GUPMultiSigWallet = artifacts.require("./GUPMultiSigWallet.sol")
// var multisig = web3.eth.accounts[1];
var coindash_company_account = web3.eth.accounts[2];
// var test = web3.eth.accounts[0];
var privstarttime = web3.eth.getBlock('latest').timestamp;
var pubstartTime = privstarttime + 3600;

module.exports = function(deployer) {
  deployer.deploy(GUPMultiSigWallet)
	.then(function() {
	  return deployer.deploy(Contribution,
	  	GUPMultiSigWallet.address,
	  	coindash_company_account,
	  	pubstartTime,
	  	privstarttime);
	})  
};

