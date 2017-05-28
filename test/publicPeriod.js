var Contribution = artifacts.require("./Contribution.sol");
var GUPToken = artifacts.require("./GUPToken.sol");
var GUPMultiSigWallet = artifacts.require("./GUPMultiSigWallet.sol")
var send = require("./util").send;
var guptokenadd;
var GUPTokenDeployed;
var ContributionDeployed;
var ownerAdd;
var multisigAdd;
var publicStartTime;

contract('public-contribuition-period', function(accounts){
  // const BTCSUISSE = accounts[0];
  const MATCHPOOL = accounts[2];
  // const MULTISIG = accounts[1];

  //Fetch deployed contracts
  before("fetch deployed instances",function(){
    return Contribution.deployed()
        .then(function(instance){
          ContributionDeployed = instance;
          return ContributionDeployed.ownerAddress() 
        })
        .then(function(address){
          ownerAdd = address;
          return ContributionDeployed.gupToken()
        })
        .then(function(instance){
          guptokenadd = instance;
          GUPTokenDeployed = GUPToken.at(guptokenadd);
          return GUPMultiSigWallet.deployed()
        })
        .then(function(instance){
          return instance.address
        })
        .then(function(address){
          multisigAdd = address;
        })
  })

  before("should have a start time", function(){
    return ContributionDeployed.publicStartTime().then(function(instance){
      publicStartTime = instance;
      assert.notEqual(instance,0,"starttime equals zero");
      console.log("public Start Time", instance.toString());
    });
  });

  before("advance time", function(){
    return ContributionDeployed.publicStartTime().then(function(instance){
      console.log("old time: ", web3.eth.getBlock('latest').timestamp)
      send('evm_increaseTime',[publicStartTime - web3.eth.getBlock('latest').timestamp - 1],function(err,result){
        send('evm_mine',[],function(){
          console.log("new time: ", web3.eth.getBlock('latest').timestamp)
        })
      });
    })
  })

  

});
