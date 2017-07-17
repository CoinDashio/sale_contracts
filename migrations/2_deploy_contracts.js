var Contribution = artifacts.require("./Contribution.sol")
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")

var pubstartTime = 1500294900;

var coindash_company_account = '0xA869b2674914Ec42b66daFE65acaC797CD241CBA';
var signers = ['0xA869b2674914Ec42b66daFE65acaC797CD241CBA', '0x2A33727f6905C4d267A1Ac4aa08a95712e6caca1', '0x517Ddb348dD59DAaef1533b693A38eD8631817a7'];

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

