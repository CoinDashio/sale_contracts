var Contribution = artifacts.require("./Contribution.sol");
var CDTToken = artifacts.require("./CDTToken.sol");
var send = require("./util").send;
var CDTTokenadd;
var CDTTokenDeployed;
var ContributionDeployed;
var ownerAdd;
var multisigAdd;
var publicEndTime;

contract('after period', function(accounts){
  //Fetch deployed contracts
  before("fetch deployed instances",function(){
    return Contribution.deployed()
        .then(function(instance){
          ContributionDeployed = instance;
          return ContributionDeployed.ownerAddress() 
        })
        .then(function(address){
          ownerAdd = address;
          return ContributionDeployed.cdtToken()
        })
        .then(function(instance){
          CDTTokenadd = instance;
          CDTTokenDeployed = CDTToken.at(CDTTokenadd);
        })
  })
  it("Should have an end time", function(){
    return Contribution.deployed().then(function(instance){
      return instance.publicEndTime().then(function(instance){
        publicEndTime = instance
        console.log("Public End Time", instance.toString())
      });
    });
  });


  /*
    buy tokens to use later
  */
  it("buy should work and send CDT + ether", function(done){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(100, 'ether'), gas:200000},(err,result)=>{
      if (!err && result) {
        CDTTokenDeployed.balanceOf(web3.eth.accounts[4]).then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()), 609300,"mis-match");
          console.log("purchased CDT: ", web3.fromWei(instance.toNumber()))
          done()
        })
      }
      else {
        assert.equal(1,0,err);
        done()
      }
    });
  })


  /*
    advance time to after contribuition period
  */
  it("advance time", function(){
    return ContributionDeployed.publicStartTime().then(function(instance){
      console.log("old time: ", web3.eth.getBlock('latest').timestamp)
      send('evm_increaseTime',[publicEndTime - web3.eth.getBlock('latest').timestamp],function(err,result){
        send('evm_mine',[],function(){
          console.log("new time: ", web3.eth.getBlock('latest').timestamp)
        })
      });
    })
  })

  /*
    transferability
  */
  it("Tokens should now be transferrable", function(){
    return CDTTokenDeployed.transfer(accounts[5],web3.toWei(50),{from:accounts[4]})
    .then(function(){
      return CDTTokenDeployed.balanceOf(accounts[5])
    })
    .then(function(instance){
      assert.equal(web3.fromWei(instance.toNumber()),50,"tokens transferred")
      console.log("New recipient Balance: ", instance.toNumber())
    })
  })
  it("Can't transfer more than account has", function(){
    return CDTTokenDeployed.transfer(accounts[5],625000,{from:accounts[4]})
    .then(function(){
      assert.true(false, "mis-match");
    })
    .catch(function(balance){
      return CDTTokenDeployed.balanceOf(accounts[4]).then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()),609250,"tokens transferred")
      })
    })
  })
  it("Can't transfer negative values", function(){
    return CDTTokenDeployed.transfer(accounts[5],-50,{from:accounts[4]})
    .then(function(){
      assert.true(false, "mis-match");
    })
    .catch(function(balance){
      return CDTTokenDeployed.balanceOf(accounts[4]).then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()),609250,"tokens transferred")
      })
    })
  })

  /*
    non contribuitable
  */
  it("buy should throw and shouldn't create CDT", function(){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[6],value: web3.toWei(1, 'ether'), gas:200000},(err,result)=>{
      if (!err) {
        assert.fail("")
      }
      else {
        return CDTTokenDeployed.balanceOf(accounts[6]).then(function(instance){
          assert.equal(instance.toNumber(),0,"tokens transferred")
        })
      }
    });
  })

  /*
    drain non sold CDT
  */
  it("can't empty Contribuition Pool from non owner", function(){
    return ContributionDeployed.emptyContribuitionPool('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c090000',{from:web3.eth.accounts[6]})
    .then(function(){
      assert.true(false, "can't empty Contribuition Pool from non owner");
    })
    .catch(function(error){
      assert.notEqual(error, null)
    })
  })
  it("empty Contribuition Pool", function(){
    return ContributionDeployed.emptyContribuitionPool('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c090000',{from:ownerAdd})
    .then(function(){
      return CDTTokenDeployed.balanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c090000');
    })
    .then(function(balance){
      assert.equal(web3.fromWei(balance.toNumber()),486890700,"mis-match")
    })
  })
});
