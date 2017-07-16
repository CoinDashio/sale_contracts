pragma solidity ^0.4.8;

import "./CDTToken.sol";
// import "./SafeMath.sol";
import 'zeppelin-solidity/contracts/SafeMath.sol';

contract Contribution /*is SafeMath*/ {
	using SafeMath for uint;

	uint public constant decimals = 18;  // 18 decimal places, the same as ETH.

	//CONSTANTS
	//Time limits
	uint public constant STAGE_ONE_TIME_END 	= 1 days;
	uint public constant STAGE_TWO_TIME_END 	= 1 weeks;
	uint public constant STAGE_THREE_TIME_END	= 2 weeks;
	uint public constant STAGE_FOUR_TIME_END 	= 4 weeks;

	//CDTToken Token Limits
	uint public constant CAP 					= 80000 ether;
	uint public constant MAX_SUPPLY 			= decimalMulti(1000000000); // billion CDT
	 
	// allocations
	uint public constant ALLOC_LIQUID_CONTRIB	= decimalMulti(100000000); // 100M CDT = 10%
	uint public constant ALLOC_ILLIQUID_TEAM 	= decimalMulti(100000000); // 100M CDT = 10%
	uint public constant ALLOC_BOUNTIES 		= decimalMulti(10000000); // 10M CDT = 1%
	uint public constant ALLOC_WINGS 			= decimalMulti(12500000); // 12.5M CDT = 1.25%
	uint public constant ALLOC_COMPANY 			= decimalMulti(290000000); // 290M CDT = 29%
	uint public constant ALLOC_CROWDSALE 		= decimalMulti(487500000); // 487.5M CDT = 48.75%

	//Prices of CDTToken
	uint public constant PRICE_STAGE_FOUR 	= decimalMulti(4687); // 0% bonus
	uint public constant PRICE_STAGE_THREE 	= decimalMulti(5155); // 10% bonus
	uint public constant PRICE_STAGE_TWO 	= decimalMulti(5624); // 20% bonus
	uint public constant PRICE_STAGE_ONE 	= decimalMulti(6093); // 30% bonus

	//ASSIGNED IN INITIALIZATION
	//Start and end times
	uint public publicStartTime; //Time in seconds public crowd fund starts.
	uint public publicEndTime; //Time in seconds crowdsale ends
	//Special Addresses
	address public multisigAddress; //Address to which all ether flows.
	address public coindashAddress; //Address to which ALLOC_BOUNTIES, ALLOC_LIQUID_CONTRIB, ALLOC_NEW_USERS, ALLOC_ILLIQUID_TEAM is sent to.
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
		cdtToken.transfer(coindashAddress, ALLOC_LIQUID_CONTRIB); // liquid = 10%

		// bounties
		cdtToken.transfer(coindashAddress, ALLOC_BOUNTIES); // = 1%

		// wings forecast bounty
		cdtToken.transfer(coindashAddress, ALLOC_WINGS); // = 1%
		
		// company
		cdtToken.grantVestedTokens(coindashAddress, 
				ALLOC_COMPANY,
				uint64(publicEndTime),
				uint64(publicEndTime + (52 weeks)), // cliff of 1 year
				uint64(publicEndTime + (52 weeks)), // no vesting after cliff
				true, 
				false
			); // 29%

		// leaves 48.75% for crowdsale
	}

	function allocateTokensWithVestingToTeam(uint time) private {
		cdtToken.grantVestedTokens(0x9c160d7450400b59AA3e7D1a8cc4Bf664859aB4B, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year
				true, 
				false
			); // team 1
		cdtToken.grantVestedTokens(0x97251AA8f0a71b10E90077AebabEd0c1e2626455, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 2
		cdtToken.grantVestedTokens(0xBA361d8b9A6D7CE1603Cf526604ce5431ecc0E76, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 3
		cdtToken.grantVestedTokens(0x0C60180e5F1dEf7Daa947F88bF840dCeF8A27f53, 
				decimalMulti(20000000),
				uint64(time),
				uint64(publicEndTime + (26 weeks)), // cliff of 6 months
				uint64(publicEndTime + (52 weeks)), // vesting of 1 year 
				true, 
				false
			); // team 4
		cdtToken.grantVestedTokens(0x3f0C1028d5F55CaA11208173D8AE09d42c3ff5B0, 
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
		cdtToken.transfer(_to, (ALLOC_CROWDSALE.sub(cdtSold)));
	}

	//failsafe drain
	function drain()
		only_owner
	{
		if (!ownerAddress.send(this.balance)) throw;
	}
}
