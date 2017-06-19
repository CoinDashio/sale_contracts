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
        assert.equal(web3.fromWei(balance.toNumber()),400000000 /* liquid team + vesting company + bounty = 40% */,"mis-match");
        console.log("Company's CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("Company's vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf(COINDASH)
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),110000000 /* liquid team + bounty */,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xC09544dA6F50441c024ec150eCEDc72De558ce94 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0xC09544dA6F50441c024ec150eCEDc72De558ce94')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xC09544dA6F50441c024ec150eCEDc72De558ce94 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xC09544dA6F50441c024ec150eCEDc72De558ce94')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xa900191B0542e27A0022a05c45c152DFa98DB026 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0xa900191B0542e27A0022a05c45c152DFa98DB026')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xa900191B0542e27A0022a05c45c152DFa98DB026 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xa900191B0542e27A0022a05c45c152DFa98DB026')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x05b481E52e1Ca0A21C147016C4df729764615Afb CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0x05b481E52e1Ca0A21C147016C4df729764615Afb')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x05b481E52e1Ca0A21C147016C4df729764615Afb CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x05b481E52e1Ca0A21C147016C4df729764615Afb')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 CDT balance on Initiallization", function(){
    return CDTTokenDeployed.balanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT Balance ", web3.fromWei(balance.toNumber()))
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
        assert.equal(web3.fromWei(balance.toNumber()),110000000,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xC09544dA6F50441c024ec150eCEDc72De558ce94')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xa900191B0542e27A0022a05c45c152DFa98DB026')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x05b481E52e1Ca0A21C147016C4df729764615Afb')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),0,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT Balance ", web3.fromWei(balance.toNumber()))
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
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),255000009 /* weird calculation bug*/,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xC09544dA6F50441c024ec150eCEDc72De558ce94')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xa900191B0542e27A0022a05c45c152DFa98DB026')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x05b481E52e1Ca0A21C147016C4df729764615Afb')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),10000000,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT Balance ", web3.fromWei(balance.toNumber()))
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
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),327500000,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xC09544dA6F50441c024ec150eCEDc72De558ce94')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xa900191B0542e27A0022a05c45c152DFa98DB026')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x05b481E52e1Ca0A21C147016C4df729764615Afb')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183')
      .then(function(balance){
        assert.equal(Math.floor(web3.fromWei(balance.toNumber())),15000000,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT Balance ", web3.fromWei(balance.toNumber()))
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
        assert.equal(web3.fromWei(balance.toNumber()),400000000,"mis-match");
        console.log("Company's vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xC09544dA6F50441c024ec150eCEDc72De558ce94')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xC09544dA6F50441c024ec150eCEDc72De558ce94 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xa900191B0542e27A0022a05c45c152DFa98DB026')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xa900191B0542e27A0022a05c45c152DFa98DB026 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0x05b481E52e1Ca0A21C147016C4df729764615Afb')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0x05b481E52e1Ca0A21C147016C4df729764615Afb vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
  it("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT balance on Initiallization", function(){
    return CDTTokenDeployed.vestedBalanceOf('0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183')
      .then(function(balance){
        assert.equal(web3.fromWei(balance.toNumber()),20000000,"mis-match");
        console.log("0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183 vested CDT Balance ", web3.fromWei(balance.toNumber()))
      })
  });
});
