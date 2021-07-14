// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

// the delegate part is in delegate.sol

import './Delegate.sol';

contract Delegation {
    address public owner;
    Delegate delegate;

    constructor (address _delegateAddress) public { 
        delegate = Delegate(_delegateAddress);
        owner = msg.sender;
    }

    fallback() external {
        (bool result, bytes memory data) = address(delegate).delegatecall(msg.data);
        if (result) {
            this;
        }
    }
}
