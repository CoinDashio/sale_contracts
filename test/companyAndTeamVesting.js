var Contribution = artifacts.require("./Contribution.sol");
var CDTToken = artifacts.require("./CDTToken.sol");
var send = require("./util").send;
var sendPromise = require("./util").sendPromise;
var CDTTokenadd;
var CDTTokenDeployed;
var ContributionDeployed;
var ownerAdd;
var multisigAdd;
var publicEndTime;

const twenty_six_weeks = /*weeks*/ 26 * /*days*/ 7 * /*hours*/ 24 * /*minutes*/60 * /*seconds*/60;

contract('after period', function(accounts){
  const COINDASH = accounts[0];

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

  it("Company's CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf(COINDASH)
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),412500000 /* liquid team + vesting company + bounty + WINGS = 41.5% */,"mis-match");
        console.log("Company's CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("Company's vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),122500000 /* liquid team + bounty + WINGS */,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0x97251AA8f0a71b10E90077AebabEd0c1e2626455')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x97251AA8f0a71b10E90077AebabEd0c1e2626455')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });


  /*
    advance time to a day before cliff
  */
  it("advance time", function(done){
    console.log("old time: ", web3.eth.getBlock('latest').timestamp)
	  send('evm_increaseTime',[publicEndTime.toNumber() + (twenty_six_weeks - 2) - web3.eth.getBlock('latest').timestamp ],function(err,result){
    send('evm_mine',[],function(){
      console.log("day before cliff time: ", web3.eth.getBlock('latest').timestamp)
      done()
    })
	});
  })

  it("Company's vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),122500000,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x97251AA8f0a71b10E90077AebabEd0c1e2626455')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });

  /*
    advance time to cliff
  */
  it("advance time", function(done){
    console.log("old time: ", web3.eth.getBlock('latest').timestamp)
  	send('evm_increaseTime',[publicEndTime.toNumber() + (twenty_six_weeks) - web3.eth.getBlock('latest').timestamp ],function(err,result){
  	    send('evm_mine',[],function(){
  	      console.log("after cliff time: ", web3.eth.getBlock('latest').timestamp)
          done()
  	    })
  	});
  })

  it("Company's vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),267500000 /* weird calculation bug*/,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x97251AA8f0a71b10E90077AebabEd0c1e2626455')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });

  /*
    advance time to mid cliff
  */
  it("advance time", function(done){
    console.log("old time: ", web3.eth.getBlock('latest').timestamp)
	send('evm_increaseTime',[publicEndTime.toNumber() + (twenty_six_weeks + twenty_six_weeks/2) - web3.eth.getBlock('latest').timestamp ],function(err,result){
	    send('evm_mine',[],function(){
	      console.log("mid cliff time: ", web3.eth.getBlock('latest').timestamp)
        done()
	    })
	});
  })

  it("Company's vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),340000000,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x97251AA8f0a71b10E90077AebabEd0c1e2626455')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });

  /*
    advance time to end of vesting
  */
  it("advance time", function(done){
    console.log("old time: ", web3.eth.getBlock('latest').timestamp)
  	send('evm_increaseTime',[publicEndTime.toNumber() + (2*twenty_six_weeks) - web3.eth.getBlock('latest').timestamp ],function(err,result){
  	    send('evm_mine',[],function(){
  	      console.log("end of vesting time: ", web3.eth.getBlock('latest').timestamp)
          done()
  	    })
  	});
  })

  it("Company's vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),412500000,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x97251AA8f0a71b10E90077AebabEd0c1e2626455')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x97251AA8f0a71b10E90077AebabEd0c1e2626455 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });

  /*
    test transfering after vesting ends
  */
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD0000 should have 0 balance", function(){
    return CDTTokenDeployed.balanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD0000')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD0000 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });

  it("transfer balance", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        return CDTTokenDeployed.transfer('0xc6bFce8cEad4EcC595bA227b9527AFA914dD0000' /* test account */,balance.toNumber(),{from:COINDASH})
      })
      .then(function(){
        return CDTTokenDeployed.balanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD0000')
      })
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),412500000,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD0000 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
});
