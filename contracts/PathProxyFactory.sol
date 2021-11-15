// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GeneralPathProxy.sol";
import "./interfaces/IGeneralPathProxy.sol";

/// @notice Path Proxy's Factory
contract PathProxyFactory is Ownable {
    string public name;

    string public symbol;

    address dev;

    uint256 fee;

    mapping(address => address) public proxyMap;

    mapping(address => bool) public proxyExists;

    address[] public users;

    address[] public whiteList;
    mapping(address => bool) public isWhiteListed;

    event CreateProxy(address dev, uint256 fee, address owner, address factory);
    event SetFee(uint256 fee);
    event SetDev(address _dev);
    event AddWhiteList(address contractAddress);
    event RemoveWhiteList(address contractAddr);
    event TransferFactoryTo(address _fac);

    constructor(
        address _owner,
        address _dev,
        uint256 _fee
    ) {
        name = "Path Proxy Factory";
        symbol = "FACTORY_V1";

        require(_dev != address(0), "DEV_CAN_T_BE_0");
        require(_owner != address(0), "OWNER_CAN_T_BE_0");
        dev = _dev;
        fee = _fee;
        transferOwnership(_owner);
    }

    function createProxy() public {
        require(whiteList.length > 0, "NO_WHITE_LIST");
        require(msg.sender != address(0), "USER_CAN_T_BE_0");
        require(proxyExists[msg.sender] == false, "USER_ALREADY_HAS_A_PROXY");
        GeneralPathProxy proxy = new GeneralPathProxy(
            dev,
            fee,
            msg.sender,
            address(this)
        );
        for (uint256 i = 0; i < whiteList.length; i++) {
            if (whiteList[i] != address(0)) {
                proxy.addWhiteList(whiteList[i]);
            }
        }
        proxyMap[msg.sender] = address(proxy);
        proxyExists[msg.sender] = true;
        users.push(msg.sender);
        emit CreateProxy(dev, fee, msg.sender, address(this));
    }

    function setFee(uint256 _fee) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.setFee(_fee);
        }
        fee = _fee;
        emit SetFee(_fee);
    }

    function setDev(address _dev) external onlyOwner {
        require(_dev != address(0), "0_ADDRESS_CAN_T_BE_A_DEV");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.setDev(_dev);
        }
        dev = _dev;
        emit SetDev(_dev);
    }

    function addWhiteList(address contractAddr) public onlyOwner {
        require(contractAddr != address(0), "ADDRESS_CAN_T_BE_0");
        require(isWhiteListed[contractAddr] == false, "ADDRESS_ALREADY_EXISTS");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.addWhiteList(contractAddr);
        }
        whiteList.push(contractAddr);
        isWhiteListed[contractAddr] = true;
        emit AddWhiteList(contractAddr);
    }

    function removeWhiteList(address contractAddr) public onlyOwner {
        require(contractAddr != address(0), "ADDRESS_CAN_T_BE_0");
        require(isWhiteListed[contractAddr] == true, "ADDRESS_NOT_EXISTS");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.removeWhiteList(contractAddr);
        }
        for (uint256 i = 0; i < whiteList.length; i++) {
            if (whiteList[i] == contractAddr) {
                whiteList[i] = address(0);
            }
        }
        isWhiteListed[contractAddr] = false;
        emit RemoveWhiteList(contractAddr);
    }

    function tranferFactoryTo(address _fac) public onlyOwner {
        require(_fac != address(0), "FACTORY_CAN_T_BE_0");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.transferFactoryTo(_fac);
        }
        emit TransferFactoryTo(_fac);
    }
}
