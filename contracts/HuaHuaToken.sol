// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/erc20/ERC20.sol";

contract HuaHuaToken is ERC20 {
    constructor() ERC20("Huahua Token", "HHT") {}
}
