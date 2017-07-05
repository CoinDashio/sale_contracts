pragma solidity ^0.4.8;

import "./CDTToken.sol";
// import "./SafeMath.sol";
import 'zeppelin-solidity/contracts/SafeMath.sol';

contract Contribution /*is SafeMath*/ {
	using SafeMath for uint;

	uint public constant decimals = 18;  // 18 decimal places, the same as ETH.

	//CONSTANTS
	//Time limits
	uint public constant STAGE_ONE_TIME_END 	= 3 days;
	uint public constant STAGE_TWO_TIME_END 	= 1 weeks;
	uint public constant STAGE_THREE_TIME_END	= 2 weeks;
	uint public constant STAGE_FOUR_TIME_END 	= 4 weeks;

	//CDTToken Token Limits
	uint public constant CAP 					= 40000 ether;
	uint public constant MAX_SUPPLY 			= decimalMulti(1000000000); // billion CDT
	 
	// allocations
	uint public constant ALLOC_LIQUID_TEAM 		= decimalMulti(100000000); // 100M CDT = 10%
	uint public constant ALLOC_ILLIQUID_TEAM 	= decimalMulti(100000000); // 100M CDT = 10%
	uint public constant ALLOC_BOUNTIES 		= decimalMulti(10000000); // 10M CDT = 1%
	uint public constant ALLOC_WINGS 			= decimalMulti(12500000); // 12.5M CDT = 1.25%
	uint public constant ALLOC_COMPANY 			= decimalMulti(290000000); // 290M CDT = 29%
	uint public constant ALLOC_CROWDSALE 		= decimalMulti(485000000); // 485M CDT = 48.5%

	//Prices of CDTToken
	uint public constant PRICE_STAGE_FOUR 	= decimalMulti(9300); // 0% bonus
	uint public constant PRICE_STAGE_THREE 	= decimalMulti(10200); // 10% bonus
	uint public constant PRICE_STAGE_TWO 	= decimalMulti(11200); // 20% bonus
	uint public constant PRICE_STAGE_ONE 	= decimalMulti(12125); // 30% bonus

	//ASSIGNED IN INITIALIZATION
	//Start and end times
	uint public publicStartTime; //Time in seconds public crowd fund starts.
	uint public publicEndTime; //Time in seconds crowdsale ends
	//Special Addresses
	address public multisigAddress; //Address to which all ether flows.
	address public coindashAddress; //Address to which ALLOC_BOUNTIES, ALLOC_LIQUID_TEAM, ALLOC_NEW_USERS, ALLOC_ILLIQUID_TEAM is sent to.
	address public ownerAddress; //Address of the contract owner. Can halt the crowdsale.
	//Contracts
	CDTToken public cdtToken; //External token contract hollding the CDTToken
	//Running totals
	uint public weiReceived; //Total wei raised.
	uint public cdtSold; //Total CDTToken created

	//booleans
	bool public halted; //halts the crowd sale if true.

	//FUNCTION MODIFIERS

	//Is currently in the period after the private start time and before the public start time.
	modifier is_post_crowdfund_period() {
		if (now < publicEndTime) throw;
		_;
	}

	//Is currently the crowdfund period
	modifier is_crowdfund_period() {
		if (now < publicStartTime || now >= publicEndTime) throw;
		_;
	}

	//May only be called by the owner address
	modifier only_owner() {
		if (msg.sender != ownerAddress) throw;
		_;
	}

	//May only be called if the crowdfund has not been halted
	modifier is_not_halted() {
		if (halted) throw;
		_;
	}

	// EVENTS

	event PreBuy(uint _amount);
	event Buy(address indexed _recipient, uint _amount);


	// FUNCTIONS

	// giving a number of CDT as input will return elevated to the decimal precision
	function decimalMulti(uint input) private returns (uint) {
		return input * 10 ** decimals;
	}

	//Initialization function. Deploys CDTToken contract assigns values, to all remaining fields, creates first entitlements in the cdt Token contract.
	function Contribution(
		address _multisig,
		address _coindash,
		uint _publicStartTime
	) {
		ownerAddress = msg.sender;
		publicStartTime = _publicStartTime;
		publicEndTime = _publicStartTime + STAGE_FOUR_TIME_END; // end of Contribution
		multisigAddress = _multisig;
		coindashAddress = _coindash;

		cdtToken = new CDTToken(MAX_SUPPLY); // all tokens initially assigned to this contract

		// team
		allocateTokensWithVestingToTeam(publicEndTime); // total 20%

		// bounties
		cdtToken.transfer(coindashAddress, ALLOC_BOUNTIES); // = 1%

		// wings forecast bounty
		cdtToken.transfer(coindashAddress, ALLOC_WINGS); // = 1%
		
		// company
		cdtToken.grantVestedTokens(coindashAddress, 
				ALLOC_COMPANY,
				uint64(publicEndTime),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year
				true, 
				false
			); // 29%

		// leaves 48.5% for crowdsale
	}

	function allocateTokensWithVestingToTeam(uint time) private {
		cdtToken.transfer(coindashAddress, ALLOC_LIQUID_TEAM); // liquid = 10%

		cdtToken.grantVestedTokens(0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year
				true, 
				false
			); // team 1
		cdtToken.grantVestedTokens(0xC09544dA6F50441c024ec150eCEDc72De558ce94, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 2
		cdtToken.grantVestedTokens(0xa900191B0542e27A0022a05c45c152DFa98DB026, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 3
		cdtToken.grantVestedTokens(0x05b481E52e1Ca0A21C147016C4df729764615Afb, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 4
		cdtToken.grantVestedTokens(0xc6bFce8cEad4EcC595bA227b9527AFA914dD8183, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 5
	}

	//May be used by owner of contract to halt crowdsale and no longer except ether.
	function toggleHalt(bool _halted)
		only_owner
	{
		halted = _halted;
	}

	//constant function returns the current cdt price.
	function getPriceRate()
		constant
		returns (uint o_rate)
	{
		if (now <= publicStartTime + STAGE_ONE_TIME_END) return PRICE_STAGE_ONE;
		if (now <= publicStartTime + STAGE_TWO_TIME_END) return PRICE_STAGE_TWO;
		if (now <= publicStartTime + STAGE_THREE_TIME_END) return PRICE_STAGE_THREE;
		if (now <= publicStartTime + STAGE_FOUR_TIME_END) return PRICE_STAGE_FOUR;
		else return 0;
	}

	// Given the rate of a purchase and the remaining tokens in this tranche, it
	// will throw if the sale would take it past the limit of the tranche.
	// It executes the purchase for the appropriate amount of tokens, which
	// involves adding it to the total, minting cdt tokens and stashing the
	// ether.
	// Returns `amount` in scope as the number of cdt tokens that it will
	// purchase.
	function processPurchase(address _to, uint _rate)
		internal
		returns (uint o_amount)
	{

		o_amount = msg.value.mul(_rate).div(1 ether);

		if (weiReceived.add(msg.value) > CAP || cdtSold.add(o_amount) > ALLOC_CROWDSALE) throw;

		if (!multisigAddress.send(msg.value)) throw;
		cdtToken.transfer(_to, o_amount); // will throw if not completed.

		weiReceived = weiReceived.add(msg.value);
		cdtSold = cdtSold.add(o_amount);
	}

	//Default function called by sending Ether to this address with no arguments.
	//Results in creation of new cdt Tokens if transaction would not exceed hard limit of cdt Token.
	function()
		payable
		is_crowdfund_period
		is_not_halted
	{
		uint amount = processPurchase(msg.sender, getPriceRate());
		Buy(msg.sender, amount);
	}

	function emptyContribuitionPool(address _to) 
		only_owner
		is_post_crowdfund_period
	{
		cdtToken.transfer(_to, (ALLOC_CROWDSALE - cdtSold));
	}

	//failsafe drain
	function drain()
		only_owner
	{
		if (!ownerAddress.send(this.balance)) throw;
	}
}
