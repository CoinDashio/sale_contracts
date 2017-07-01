var Contribution = artifacts.require("./Contribution.sol")
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")

var pubstartTime = web3.eth.getBlock('latest').timestamp;

var coindash_company_account = '0x0046c77E711Afa86ac71889BC3Ff4bCEBcb8CC7F';
var signers = [coindash_company_account, '0x008a9943e55FfF50124A1FFAD63f2a0dd63bF6a2', '0x001Babe793665324BB66d6651f7abAb41C7e685A'];

module.exports = function(deployer) {

  console.log("\nDeployment:\nPublic Start Time " + pubstartTime);

  deployer.deploy(CDTMultiSigWallet, signers, 2)
	.then(function() {
	  return deployer.deploy(Contribution,
	  	CDTMultiSigWallet.address,
	  	coindash_company_account,
	  	pubstartTime);
	})  
};

