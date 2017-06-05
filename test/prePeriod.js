var Contribution = artifacts.require("./Contribution.sol");
var GUPToken = artifacts.require("./GUPToken.sol");
var GUPMultiSigWallet = artifacts.require("./GUPMultiSigWallet.sol")
var send = require("./util").send;
var sendPromise = require("./util").sendPromise;
var guptokenadd;
var GUPTokenDeployed;
var ContributionDeployed;
var ContributionDeployedAdd;
var ownerAdd;
var multisigAdd;
var publicStartTime;

contract('Pre-period', function(accounts){
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
          return ContributionDeployed.address
        })
        .then(function(address){
          ContributionDeployedAdd = address;
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
  it("should have a start time", function(){
    return ContributionDeployed.publicStartTime().then(function(instance){
      publicStartTime = instance;
      assert.notEqual(instance,0,"starttime equals zero");
      console.log("public Start Time", instance.toString());
    });
  });
  it("should have a private start time", function(){
    return ContributionDeployed.privateStartTime().then(function(instance){
      assert.notEqual(instance,0,"starttime equals zero");
      console.log("private Start Time", instance.toString());
    });
  });

  //TO BE REWRITTEN START
  it("Should have an end time", function(){
    return Contribution.deployed().then(function(instance){
      return instance.publicEndTime().then(function(instance){
        assert.notEqual(instance,0,"end time equals zero");
        console.log("Public End Time", instance.toString())
      });
    });
  });
  it("Should have a Matchpool account", function(){
    return Contribution.deployed().then(function(instance){
      return instance.matchpoolAddress().then(function(instance){
        assert.equal(instance,MATCHPOOL,"mis-match");
        console.log("matchpool account: ", instance.toString())
      });
    });
  });
  it("Should have a multisig account", function(){
    return Contribution.deployed().then(function(instance){
      return instance.multisigAddress().then(function(instance){
        assert.equal(instance,multisigAdd,"mis-match");
        console.log("multisig account: ", instance.toString())
      });
    });
  });
  //END

  /*
    confribuition
  */
  it("buy should not work and should throw", function(){
    web3.eth.sendTransaction({to: ContributionDeployed.address, from: web3.eth.accounts[4],value: web3.toWei(1, 'ether'), gas:200000},(err,result)=>{
      if (!err) {
        assert.fail("")
      }
    });
  })

  /*
    Pre - buy
  */
  it("Pre committmets Should be able to buy early", function(){
    return ContributionDeployed.preCommit(web3.eth.accounts[5], {from: ownerAdd,value: web3.toWei(100, 'ether'), gas:200000})
      .then(function(){
        return GUPTokenDeployed.balanceOf(web3.eth.accounts[5])
      })
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),625000,"mis-match");
        console.log("Pre preCommittmets Balance ", balance.toNumber())
      })
  });
  it("Other accounts should not be able to buy early", function(){
    return ContributionDeployed.preCommit(web3.eth.accounts[6], {from: web3.eth.accounts[4],value: web3.toWei(100, 'ether'), gas:200000})
      .catch(function(){
        return GUPTokenDeployed.balanceOf(web3.eth.accounts[6])
                .then(function(balance){
                  assert.equal(balance.toNumber(),0,"mis-match");
                })
      })
  });

  /*
    Halting
  */
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
  it("prebuy function fails when halted", function(){
    return ContributionDeployed.preCommit(web3.eth.accounts[5], {from: ownerAdd,value: web3.toWei(1, 'ether'), gas:200000})
    .then(function(balance){
      assert.true(false,"mis-match");
    })
    .catch(function(){
      console.log("function failed");
    })
  })
  it("test unhalting", function(){
    return ContributionDeployed.toggleHalt(false,{from: accounts[0]}).then(function(){
      return ContributionDeployed.halted().then(function(instance){
        assert.equal(instance,false,"mis-match");
        console.log("halted: ", instance)
      });
    });
  });
  it("cannot be halted by non-owner", function(){
    return ContributionDeployed.toggleHalt(true,{from: accounts[1]}).catch(function(){
      return ContributionDeployed.halted().then(function(instance){
        assert.equal(instance,false,"mis-match");
        console.log("halted: ", instance)
      });
    });
  });

  /*
    transferability
  */
  it("Tokens should not be transferrable", function(){
    return GUPTokenDeployed.transfer(accounts[6],50,{from:accounts[5]})
    .then(function(balance){
      assert.true(false,"mis-match");
    })
    .catch(function(){
      return GUPTokenDeployed.balanceOf(accounts[5]).then(function(instance){
        assert.equal(web3.fromWei(instance.toNumber()),625000,"tokens transferred")
      })
    })
  })
  it("Tokens should not be transferrable", function(){
    return GUPTokenDeployed.transferFrom(accounts[5], accounts[6],50,{from:accounts[5]})
    .then(function(balance){
      assert.true(false,"mis-match");
    })
    .catch(function(){
      return GUPTokenDeployed.balanceOf(accounts[5]).then(function(instance){
        assert.equal(web3.fromWei(instance.toNumber()),625000,"tokens transferred")
      })
    })
  })


  /*
    advance time just before the contribuition starts
  */
  it("Pre committmets Should be able to buy up to a few seconds before contribuition starts", function(){
    console.log("old time: ", web3.eth.getBlock('latest').timestamp)
    return sendPromise('evm_increaseTime',[publicStartTime - web3.eth.getBlock('latest').timestamp - 100])
        .then(function(result){
          return sendPromise('evm_mine',[])
        })
        .then(function(result){
          console.log("new time: ", web3.eth.getBlock('latest').timestamp)
          return ContributionDeployed.preCommit(web3.eth.accounts[7], {from: ownerAdd,value: web3.toWei(100, 'ether'), gas:200000})
        })
        .then(function(){
          return GUPTokenDeployed.balanceOf(web3.eth.accounts[7])
        })
        .then(function(balance){
          assert.equal(web3.fromWei(balance.toNumber()),625000,"mis-match");
          console.log("Pre preCommittmets Balance ", balance.toNumber())
        })
  })
  
  /*
    check company's remaining CDT
  */
  it("Contribuition contract's CDT balance after pre-commitments", function(){
    return GUPTokenDeployed.balanceOf(ContributionDeployedAdd)
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),498750000,"mis-match");
        console.log("Contribuition contract's CDT Balance ", balance.toNumber())
      })
  });

  /*
    total wei received
  */
  it("total wei received in pre committmets", function(){
    return ContributionDeployed.ethReceived()
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),200,"mis-match");
        console.log("total wei received ", web3.fromWei(balance.toNumber()))
      })
  });

  /*
    total CDT sold
  */
  it("total CDT sold in pre committmets", function(){
    return ContributionDeployed.gupSold()
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),1250000,"mis-match");
        console.log("total wei received ", balance.toNumber())
      })
  });

  /*
    check multisig wallet balance
  */
  it("multisig wallet contains 200 ethers", function(){
    let balance = web3.eth.getBalance(multisigAdd)
    assert.equal(web3.fromWei(balance.toNumber(),'ether'), 200, "mis-match");
    console.log("multisig wallet ended up with " + web3.fromWei(balance.toNumber(),'ether') + " ethers");
  });

  /*
    Token creation and assignment only by contribuition contract
  */
  it("Only contribuition contract can assign tokens", function(){
    return GUPTokenDeployed.assignTokensDuringContribuition(accounts[7], accounts[8], 50,{from:accounts[1]})
    .then(function(balance){
      assert.true(false,"mis-match");
    })
    .catch(function(){
      return GUPTokenDeployed.balanceOf(accounts[8])
        .then(function(balance){
          assert.equal(balance.toNumber(),0,"tokens transferred")
        })
        .then(function(){
          return GUPTokenDeployed.balanceOf(accounts[7])
        })
        .then(function(balance){
          assert.equal(web3.fromWei(balance.toNumber()),625000,"tokens transferred")
        })
    })
  })

  afterEach("contract should never have any ether", function(done){
    assert.equal(web3.eth.getBalance(ContributionDeployed.address).toNumber(),0,"is not zero")
    console.log("Contract Balance is: ",web3.eth.getBalance(ContributionDeployed.address).toNumber())
    //window.setTimeout(function(){
    done()
    //},1000);
    
  })


});
