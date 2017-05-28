pragma solidity ^0.4.6;
// import "./StandardToken.sol";
import 'zeppelin-solidity/contracts/token/VestedToken.sol';
import 'zeppelin-solidity/contracts/SafeMath.sol';

contract GUPToken is VestedToken {
	using SafeMath for uint;

	//FIELDS
	//CONSTANTS
	// uint public constant LOCKOUT_PERIOD = 1 years; //time after end date that illiquid GUP can be transferred

	//ASSIGNED IN INITIALIZATION
	uint public endContribuitionTime; //Time in seconds no more tokens can be created
	address public creator; //address of the account which may mint new tokens

	// mapping (address => uint) public illiquidBalance; //Balance of 'Frozen funds'

	//MODIFIERS
	//Can only be called by contribution contract.
	modifier only_creator {
		if (msg.sender != creator) throw;
		_;
	}

	// Can only be called if (liquid) tokens may be transferred. Happens
	// immediately after `endMintingTime`.
	modifier when_transferable {
		if (now < endContribuitionTime) throw;
		_;
	}

	// Can only be called if the `crowdfunder` is allowed to mint tokens. Any
	// time before `endMintingTime`.
	modifier contributable {
		if (now >= endContribuitionTime) throw;
		_;
	}

	// Initialization contract assigns address of crowdfund contract and end time.
	function GUPToken(address _creator, uint _endContribuitionTime) {
		endContribuitionTime = _endContribuitionTime;
		creator = _creator;
	}

	// Fallback function throws when called.
	function() {
		throw;
	}

	// // Create new tokens when called by the crowdfund contract.
	// // Only callable before the end time.
	function createToken(address _recipient, uint _value)
		contributable
		only_creator
		returns (bool o_success)
	{
		balances[_recipient] += _value;
		totalSupply += _value;
		return true;
	}

	// assignment is only avaible during contribuition time
	function assignTokensDuringContribuition(address _from, address _to, uint _value)
	 contributable 
	 only_creator 
	 canTransfer(_from, _value)
	 returns (bool o_success) {
	 	balances[_from] = balances[_from].sub(_value);
	    balances[_to] = balances[_to].add(_value);
	    return true;
	}

	// Transfer amount of tokens from sender account to recipient.
	// Only callable after the crowd fund end date.
	function transfer(address _to, uint _value) 
		when_transferable
		canTransfer(msg.sender, _value) {
	   return super.transfer(_to, _value);
	}

	// Transfer amount of tokens from a specified address to a recipient.
	// Only callable after the crowd fund end date.
	 function transferFrom(address _from, address _to, uint _value) 
	 	when_transferable
	 	canTransfer(_from, _value) {
	   return super.transferFrom(_from, _to, _value);
	}
}
