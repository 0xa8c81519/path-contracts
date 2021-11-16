const PathProxyFactory = artifacts.require('PathProxyFactory');
const ehters = require('ethers');

module.exports = function (deployer, network, accounts) {
	let dev = accounts[0];
	let owner = accounts[0];
	let fee = ehters.utils.parseEther('0.003');
	return deployer.deploy(PathProxyFactory, owner, dev, fee.toString()).then(res => {
		console.log('Constructor Parameters[0]: ' + owner);
		console.log('Constructor Parameters[1]: ' + dev);
		console.log('Constructor Parameters[2]: ' + fee.toString());
	});
};