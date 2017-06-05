var Contribution = artifacts.require("./Contribution.sol");
var CDTToken = artifacts.require("./CDTToken.sol");
var CDTMultiSigWallet = artifacts.require("./CDTMultiSigWallet.sol")
var send = require("./util").send;
var CDTTokenadd;
var CDTTokenDeployed;
var ContributionDeployed;
var ownerAdd;
var CDTMultiSigWallet;
var multisigAdd;
var publicStartTime;

contract('stage one', function(accounts){
  const MATCHPOOL = accounts[2];

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
          return CDTMultiSigWallet.deployed()
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
      send('evm_increaseTime',[publicStartTime - web3.eth.getBlock('latest').timestamp + 1 + (60 * 60) /* after power hour */],function(err,result){
        send('evm_mine',[],function(){
          console.log("new time: ", web3.eth.getBlock('latest').timestamp)
        })
      });
    })
  })

  /*
    Pre commitments
  */
  it("Pre committmets Should NOT be able to buy when contribuition starts", function(){
    return ContributionDeployed.preCommit(web3.eth.accounts[3], {from: ownerAdd,value: web3.toWei(100, 'ether')})
      .then(function(){
        assert.true(false,"mis-match");
        done()
      })
      .catch(function(error){
        return CDTTokenDeployed.balanceOf(web3.eth.accounts[3])
          .then(function(balance){
            assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
            console.log(web3.eth.accounts[3] + " account has " + web3.fromWei(balance.toNumber()) + " balance");
         })
      })
  });

  /*
    halting 
  */
  it("is not halted", function(){
    return ContributionDeployed.halted()
      .then(function(instance){
        assert.equal(instance,false,"mis-match");
        console.log("halted: ", instance)
      });
  });
  it("test halting", function(){
    return ContributionDeployed.toggleHalt(true,{from: accounts[0]})
      .then(function(){
        return ContributionDeployed.halted()
      })
      .then(function(instance){
          assert.equal(instance,true,"mis-match");
          console.log("halted: ", instance)
      });
  });
  it("buy should not work and should throw", function(done){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(1, 'ether')},(err,result)=>{
      if (!err) {
        assert.fail("")
      }
      done();
    });
  })
  it("cancel halting", function(){
    return ContributionDeployed.toggleHalt(false,{from: accounts[0]})
      .then(function(){
        return ContributionDeployed.halted()
      })
      .then(function(instance){
          assert.equal(instance,false,"mis-match");
          console.log("halted: ", instance)
      });
  });
  
  /*
    Buying
  */
  it("buy should work and send CDT + ether", function(done){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(100, 'ether'), gas:200000},(err,result)=>{
      if (!err && result) {
        CDTTokenDeployed.balanceOf(web3.eth.accounts[4]).then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()), 600000,"mis-match");
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

  it("Can buy up to 80K ETH", function(done){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(79900, 'ether'), gas:200000},(err,result)=>{
      if (!err && result) {
        CDTTokenDeployed.balanceOf(web3.eth.accounts[4]).then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()), 480000000,"mis-match");
          console.log("purchased CDT: ", web3.fromWei(instance.toNumber()))
          done()
        })
      }
      else {
        assert.true(false,"mis-match");
        done()
      }
    });
  })

  it("no more than 80,000 ETH can be contribuited", function(done){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[5],value: web3.toWei(1, 'ether'), gas:200000},(err,result)=>{
      if (err) {
        CDTTokenDeployed.balanceOf(web3.eth.accounts[5]).then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()), 0,"mis-match");
          console.log("purchased CDT: ", web3.fromWei(instance.toNumber()))
          done()
        })
      }
      else {
        assert.fail("mis-match");
        done()
      }
    });
  })

  /*
    total CDT sold
  */
  it("total CDT sold", function(){
    return ContributionDeployed.cdtSold()
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),480000000,"mis-match");
        console.log("total wei received ", web3.fromWei(balance.toNumber()))
      })
  });

  /*
    check multisig wallet balance
  */
  it("multisig wallet contains 80000 ethers", function(){
    let balance = web3.eth.getBalance(multisigAdd)
    assert.equal(web3.fromWei(balance.toNumber()), 80000, "mis-match");
    console.log("multisig wallet ended up with " + web3.fromWei(web3.fromWei(balance.toNumber()),'ether') + " ethers");
  });

  /*
    transferability 
  */
  it("Tokens should not be transferrable", function(){
    return CDTTokenDeployed.transfer(accounts[5],50,{from:MATCHPOOL})
    .then(function(instance){
        assert.fail("mis-match");
    })
    .catch(function(){
      return CDTTokenDeployed.balanceOf(accounts[5])
        .then(function(instance){
          assert.equal(web3.fromWei(instance.toNumber()),0,"tokens transferred")
        })
    })
  })

  afterEach("contract should never have any ether", function(){
    console.log("Contract Balance is: ",web3.eth.getBalance(ContributionDeployed.address).toNumber())
    assert.equal(web3.eth.getBalance(ContributionDeployed.address).toNumber(),0,"is not zero")
  })
  
});
