var Contribution = artifacts.require("./Contribution.sol");
var GUPToken = artifacts.require("./GUPToken.sol");
var GUPMultiSigWallet = artifacts.require("./GUPMultiSigWallet.sol")
var send = require("./util").send;
var guptokenadd;
var GUPTokenDeployed;
var ContributionDeployed;
var ownerAdd;
var GUPMultiSigWallet;
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

  // it("BTCS Should throw and not be able to buy during crowdsale", function(){
  //   return ContributionDeployed.preBuy({from: BTCSUISSE, value: web3.toWei(1, 'ether')}).then(function(arg){
  //     console.log(arg);
  //     return GUPTokenDeployed.balanceOf(BTCSUISSE).then(function(instance){
  //       assert.equal(instance.toNumber(),0,"mis-match");
  //       console.log("BTCS Balance ", instance.toNumber())
  //     })
  //   }).catch(function(instance){
  //     return GUPTokenDeployed.balanceOf(BTCSUISSE).then(function(instance){
  //       assert.equal(instance.toNumber(),0,"mis-match");
  //       console.log("BTCS Balance ", instance.toNumber())
  //     })
  //   });;
  // });
  
  /*
    Pre commitments
  */
  it("Pre committmets Should NOT be able to buy when contribuition starts", function(){
    return ContributionDeployed.preCommit(web3.eth.accounts[3], {from: ownerAdd,value: web3.toWei(100, 'ether')})
      .then(function(){
        assert.true(false,"mis-match");
      })
      .catch(function(error){
        return GUPTokenDeployed.balanceOf(web3.eth.accounts[3])
          .then(function(balance){
            assert.equal(balance.toNumber(),0,"mis-match");
         })
      })
  });
  
  it("buy should work and send Gup + ether", function(){
    return web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(100, 'ether')})
      .then(function(){
        return GUPTokenDeployed.balanceOf(web3.eth.accounts[3])
      })
      .then(function(balance){
          assert.equal(balance.toNumber(),1250000,"mis-match");
          console.log("contribuition balance ", balance.toNumber())
       })
  })

  it("no more than 60,000,000 GUP should be created", function(done){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(675000, 'ether')},(err,result)=>{
      if (err) {
        GUPTokenDeployed.balanceOf(web3.eth.accounts[4]).then(function(instance){
          assert.equal(instance.toNumber(), 120000,"mis-match");
          console.log("purchased GUP: ", instance.toNumber())

          done()
        })
      }
    });
  })
  it("Tokens should not be transferrable", function(){
    return GUPTokenDeployed.transfer(accounts[5],50,{from:MATCHPOOL}).catch(function(){
      return GUPTokenDeployed.balanceOf(accounts[5]).then(function(instance){
        assert.equal(instance.toNumber(),0,"tokens transferred")
      })
    })
  })
  it("is not halted", function(){
    return ContributionDeployed.halted().then(function(instance){
      assert.equal(instance,false,"mis-match");
      console.log("halted: ", instance)
    });
  });
  it("test halting", function(){
    return ContributionDeployed.toggleHalt(true,{from: accounts[0]}).then(function(){
      return ContributionDeployed.halted().then(function(instance){
        assert.equal(instance,true,"mis-match");
        console.log("halted: ", instance)
      });
    });
  });
  it("buy should not work and should throw", function(){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(1, 'ether')},(err,result)=>{
      if (!err) {
        assert.fail("")
      }
    });
  })
  afterEach("contract should never have any ether", function(done){
    assert.equal(web3.eth.getBalance(ContributionDeployed.address).toNumber(),0,"is not zero")
    console.log("Contract Balance is: ",web3.eth.getBalance(ContributionDeployed.address).toNumber())
    done()
  })
  
});
