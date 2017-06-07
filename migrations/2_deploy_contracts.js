var Contribution = artifacts.require("./Contribution.sol")
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")
var coindash_company_account = web3.eth.accounts[0];
var privstarttime = web3.eth.getBlock('latest').timestamp;
var pubstartTime = privstarttime + 3600;

var signers = ['0x7ecf34ed29ede66ecc1068b398102aa57ccbd317', '0xead02d42efe27ff850e242892577336de3d20cf9', '0xcfd980c4115825d6270d840cab900e15a65e3436'];

module.exports = function(deployer) {

  console.log("\nDeployment:\nPrivate Start Time: " + privstarttime + "\nPublic Start Time " + pubstartTime);

  deployer.deploy(CDTMultiSigWallet, signers, 2)
	.then(function() {
	  return deployer.deploy(Contribution,
	  	CDTMultiSigWallet.address,
	  	coindash_company_account,
	  	pubstartTime,
	  	privstarttime);
	})  
};

