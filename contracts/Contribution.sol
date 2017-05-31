pragma solidity ^0.4.6;

import "./GUPToken.sol";
// import "./SafeMath.sol";
import 'zeppelin-solidity/contracts/SafeMath.sol';

contract Contribution /*is SafeMath*/ {
	using SafeMath for uint;

	//FIELDS

	//CONSTANTS
	//Time limits
	uint public constant STAGE_ONE_TIME_END = 1 hours;
	uint public constant STAGE_TWO_TIME_END = 72 hours;
	uint public constant STAGE_THREE_TIME_END = 2 weeks;
	uint public constant STAGE_FOUR_TIME_END = 4 weeks;
	//Prices of GUP
	uint public constant PRICE_STAGE_ONE = 6250; // will result in 80K ether raised
	uint public constant PRICE_STAGE_TWO = 6000;
	uint public constant PRICE_STAGE_THREE = 5750;
	uint public constant PRICE_STAGE_FOUR = 5000;

	//GUP Token Limits
	uint public constant CAP =        80000 ether; 
	uint public constant MAX_SUPPLY =        1000000000; // billion CDT
	uint public constant ALLOC_LIQUID_TEAM =  100000000; // 100M CDT = 10%
	uint public constant ALLOC_ILLIQUID_TEAM =  100000000; // 100M CDT = 10%
	uint public constant ALLOC_BOUNTIES =      10000000; // 10M CDT = 1%
	uint public constant ALLOC_COMPANY =    290000000; // 290M CDT = 29%
	uint public constant ALLOC_CROWDSALE =    500000000; // 500M CDT = 50%

	//ASSIGNED IN INITIALIZATION
	//Start and end times
	uint public publicStartTime; //Time in seconds public crowd fund starts.
	uint public privateStartTime; //Time in seconds when BTCSuisse can purchase up to 125000 ETH worth of GUP;
	uint public publicEndTime; //Time in seconds crowdsale ends
	//Special Addresses
	address public multisigAddress; //Address to which all ether flows.
	address public matchpoolAddress; //Address to which ALLOC_BOUNTIES, ALLOC_LIQUID_TEAM, ALLOC_NEW_USERS, ALLOC_ILLIQUID_TEAM is sent to.
	address public ownerAddress; //Address of the contract owner. Can halt the crowdsale.
	//Contracts
	GUPToken public gupToken; //External token contract hollding the GUP
	//Running totals
	uint public ethReceived; //Total Ether raised.
	uint public gupSold; //Total GUP created
	// uint public btcsPortionTotal; //Total of Tokens purchased by BTC Suisse. Not to exceed BTCS_PORTION_MAX.
	//booleans
	bool public halted; //halts the crowd sale if true.

	//FUNCTION MODIFIERS

	//Is currently in the period after the private start time and before the public start time.
	modifier is_pre_crowdfund_period() {
		if (now >= publicStartTime || now < privateStartTime) throw;
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

	//Initialization function. Deploys GUPToken contract assigns values, to all remaining fields, creates first entitlements in the GUP Token contract.
	function Contribution(
		address _multisig,
		address _matchpool,
		uint _publicStartTime,
		uint _privateStartTime
	) {
		ownerAddress = msg.sender;
		publicStartTime = _publicStartTime;
		privateStartTime = _privateStartTime;
		publicEndTime = _publicStartTime + 4 weeks;
		multisigAddress = _multisig;
		matchpoolAddress = _matchpool;

		gupToken = new GUPToken(MAX_SUPPLY, publicEndTime); // all tokens initially assigned to company's account

		// team
		gupToken.grantVestedTokens(matchpoolAddress, 
				ALLOC_ILLIQUID_TEAM,
				uint64(_publicStartTime),
				uint64(_publicStartTime + (24 weeks)), // cliff
				uint64(_publicStartTime + (1 years)) // vesting
			); // 10%
		gupToken.assignTokensDuringContribuition(matchpoolAddress, ALLOC_LIQUID_TEAM); // = 10%

		// bounties
		gupToken.assignTokensDuringContribuition(matchpoolAddress, ALLOC_BOUNTIES); // = 1%
		
		// company
		gupToken.grantVestedTokens(matchpoolAddress, 
				ALLOC_COMPANY,
				uint64(_publicStartTime),
				uint64(_publicStartTime + (24 weeks)), // cliff
				uint64(_publicStartTime + (1 years)) // vesting
			); // 29%
	}

	//May be used by owner of contract to halt crowdsale and no longer except ether.
	function toggleHalt(bool _halted)
		only_owner
	{
		halted = _halted;
	}

	//constant function returns the current GUP price.
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
	// involves adding it to the total, minting GUP tokens and stashing the
	// ether.
	// Returns `amount` in scope as the number of GUP tokens that it will
	// purchase.
	function processPurchase(address _to, uint _rate)
		internal
		returns (uint o_amount)
	{

		o_amount = msg.value.mul(_rate).div(1 ether);

		if (ethReceived.add(msg.value) > CAP) throw;

		if (!multisigAddress.send(msg.value)) throw;
		if (!gupToken.assignTokensDuringContribuition(_to, o_amount)) throw;

		ethReceived = ethReceived.add(msg.value);
		gupSold = gupSold.add(o_amount);
	}

	//Default function called by sending Ether to this address with no arguments.
	//Results in creation of new GUP Tokens if transaction would not exceed hard limit of GUP Token.
	function()
		payable
		is_crowdfund_period
		is_not_halted
	{
		uint amount = processPurchase(msg.sender, getPriceRate());
		Buy(msg.sender, amount);
	}

	// allow to assgin pre-commitments
	function preCommit(address _to) 
		only_owner
		is_pre_crowdfund_period
		payable
		is_not_halted
	{
		uint amount = processPurchase(_to, getPriceRate());
		Buy(msg.sender, amount);
	}

	//failsafe drain
	function drain()
		only_owner
	{
		if (!ownerAddress.send(this.balance)) throw;
	}
}
