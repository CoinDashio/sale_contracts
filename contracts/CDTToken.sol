pragma solidity ^0.4.6;
// import "./StandardToken.sol";
import 'zeppelin-solidity/contracts/token/VestedToken.sol';
import 'zeppelin-solidity/contracts/SafeMath.sol';

contract CDTToken is VestedToken {
	using SafeMath for uint;

	//FIELDS
	//CONSTANTS
	uint public constant decimals = 18;  // 18 decimal places, the same as ETH.
	string public constant name = "CoinDash Token";
  	string public constant symbol = "CDT";

	//ASSIGNED IN INITIALIZATION
	address public creator; //address of the account which may mint new tokens

	// Initialization contract assigns address of crowdfund contract and end time.
	function CDTToken(uint supply) {
		totalSupply = supply;
		creator = msg.sender;
		
		balances[msg.sender] = supply;
	}

	// Fallback function throws when called.
	function() {
		throw;
	}

	function vestedBalanceOf(address _owner) constant returns (uint balance) {
	    return transferableTokens(_owner, uint64(now));
    }
}
