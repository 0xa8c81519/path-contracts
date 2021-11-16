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
    event SetFee(address _user, uint256 fee);
    event SetDev(address _user, address _dev);
    event AddWhiteList(address _user, address contractAddress);
    event RemoveWhiteList(address _user, address contractAddr);
    event TransferFactoryTo(address _user, address _fac);

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
        require(proxyExists[msg.sender] == false, "USER_ALREADY_HAS_A_PROXY");
        require(whiteList.length > 0, "NO_WHITE_LIST");
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
            emit SetFee(users[i], _fee);
        }
        fee = _fee;
    }

    function setFeeToUser(address _user, uint256 _fee) external onlyOwner {
        require(_user != address(0), "USER_MUST_NOT_0");
        require(proxyExists[_user] == true, "USER_HAVE_NOT_ANY_PROXY");
        IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[_user]);
        proxy.setFee(_fee);
        emit SetFee(_user, _fee);
    }

    function setDev(address _dev) external onlyOwner {
        require(_dev != address(0), "0_ADDRESS_CAN_T_BE_A_DEV");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.setDev(_dev);
            emit SetDev(users[i], _dev);
        }
        dev = _dev;
    }

    function setDevToUser(address _user, address _dev) external onlyOwner {
        require(_user != address(0), "USER_MUST_NOT_0");
        require(proxyExists[_user] == true, "USER_HAVE_NOT_ANY_PROXY");
        require(_dev != address(0), "0_ADDRESS_CAN_T_BE_A_DEV");
        IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[_user]);
        proxy.setDev(_dev);
        emit SetDev(_user, _dev);
    }

    function addWhiteList(address contractAddr) public onlyOwner {
        require(contractAddr != address(0), "ADDRESS_CAN_T_BE_0");
        require(isWhiteListed[contractAddr] == false, "ADDRESS_ALREADY_EXISTS");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.addWhiteList(contractAddr);
            emit AddWhiteList(users[i], contractAddr);
        }
        whiteList.push(contractAddr);
        isWhiteListed[contractAddr] = true;
    }

    function addWhiteListToUser(address _user, address contractAddr)
        public
        onlyOwner
    {
        require(_user != address(0), "USER_MUST_NOT_0");
        require(proxyExists[_user] == true, "USER_HAVE_NOT_ANY_PROXY");
        require(contractAddr != address(0), "ADDRESS_CAN_T_BE_0");
        IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[_user]);
        proxy.addWhiteList(contractAddr);
    }

    function removeWhiteList(address contractAddr) public onlyOwner {
        require(contractAddr != address(0), "ADDRESS_CAN_T_BE_0");
        require(isWhiteListed[contractAddr] == true, "ADDRESS_NOT_EXISTS");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.removeWhiteList(contractAddr);
            emit RemoveWhiteList(users[i], contractAddr);
        }
        for (uint256 i = 0; i < whiteList.length; i++) {
            if (whiteList[i] == contractAddr) {
                whiteList[i] = address(0);
            }
        }
        isWhiteListed[contractAddr] = false;
    }

    function removeWhiteListFromUser(address _user, address contractAddr)
        public
        onlyOwner
    {
        require(_user != address(0), "USER_MUST_NOT_0");
        require(proxyExists[_user] == true, "USER_HAVE_NOT_ANY_PROXY");
        require(contractAddr != address(0), "ADDRESS_CAN_T_BE_0");
        IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[_user]);
        proxy.removeWhiteList(contractAddr);
        emit RemoveWhiteList(_user, contractAddr);
    }

    function tranferFactoryTo(address _fac) public onlyOwner {
        require(_fac != address(0), "FACTORY_CAN_T_BE_0");
        for (uint256 i = 0; i < users.length; i++) {
            IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[users[i]]);
            proxy.transferFactoryTo(_fac);
            emit TransferFactoryTo(users[i], _fac);
        }
    }

    function tranferFactoryTo(address _user, address _fac) public onlyOwner {
        require(_user != address(0), "USER_MUST_NOT_0");
        require(proxyExists[_user] == true, "USER_HAVE_NOT_ANY_PROXY");
        require(_fac != address(0), "FACTORY_CAN_T_BE_0");
        IGeneralPathProxy proxy = IGeneralPathProxy(proxyMap[_user]);
        proxy.transferFactoryTo(_fac);
        emit TransferFactoryTo(_user, _fac);
    }
}
