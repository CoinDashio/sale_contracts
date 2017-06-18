pragma solidity ^0.4.6;

import 'zeppelin-solidity/contracts/MultisigWallet.sol';


/// @title Multisignature wallet - Allows multiple parties to agree on transactions before execution.
/// @author Stefan George - <stefan.george@consensys.net>
contract CDTMultiSigWallet is MultisigWallet {

    function CDTMultiSigWallet(address[] _owners, uint _required)       
    MultisigWallet(_owners, _required, 0) { }

    function changeOwner(address _from, address _to) 
        external
    {
    	// solidity can't compile virtual functions
    }
}
