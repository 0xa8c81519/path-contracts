const HuaHuaToken = artifacts.require('HuaHuaToken');
const ehters = require('ethers');

module.exports = function (deployer, network, accounts) {
	return deployer.deploy(HuaHuaToken).then(res => {
	});
};