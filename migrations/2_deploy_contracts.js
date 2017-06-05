var Contribution = artifacts.require("./Contribution.sol")
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")
var coindash_company_account = web3.eth.accounts[2];
var privstarttime = web3.eth.getBlock('latest').timestamp;
var pubstartTime = privstarttime + 3600;

module.exports = function(deployer) {

  console.log("\nDeployment:\nPrivate Start Time: " + privstarttime + "\nPublic Start Time " + pubstartTime);

  deployer.deploy(CDTMultiSigWallet)
	.then(function() {
	  return deployer.deploy(Contribution,
	  	CDTMultiSigWallet.address,
	  	coindash_company_account,
	  	pubstartTime,
	  	privstarttime);
	})  
};

