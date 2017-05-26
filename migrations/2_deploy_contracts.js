var Contribution = artifacts.require("./Contribution.sol")
var GupToken = artifacts.require("./GUPToken.sol")
var GUPMultiSigWallet = artifacts.require("./GUPMultiSigWallet.sol")
var btcsuisse = web3.eth.accounts[0];
var multisig = web3.eth.accounts[1];
var matchpool = web3.eth.accounts[2];
var test = web3.eth.accounts[0];
var privstarttime = web3.eth.getBlock('latest').timestamp;
var pubstartTime = privstarttime + 3600;

module.exports = function(deployer) {
  var guptoken, contribution, a;


  deployer.deploy(GupToken)
  	.then(function() {
	  return deployer.deploy(GUPMultiSigWallet)
	})
	.then(function() {
	  return deployer.deploy(Contribution,btcsuisse,GUPMultiSigWallet.address,GupToken.address,pubstartTime,privstarttime);
	})  
};

