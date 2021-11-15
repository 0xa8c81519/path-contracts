// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IGeneralPathProxy {
    function addWhiteList(address contractAddr) external;

    function removeWhiteList(address contractAddr) external;

    function swap(
        address fromToken,
        address toToken,
        address approveTarget,
        uint256 fromTokenAmount,
        bytes calldata callDataConcat,
        uint256 deadLine,
        bool isCrossChain
    ) external payable;

    function setFee(uint256 _fee) external;

    function withdrawETH() external;

    function withdtraw(address token) external;

    function setDev(address _dev) external;

    function transferFactoryTo(address _fac) external;
}
