const GeneralPathProxy = artifacts.require('GeneralPathProxy');
const ehters = require('ethers');

module.exports = function (deployer, network, accounts) {
	let dev = accounts[0];
	let owner = accounts[0];
	let fee = ehters.utils.parseEther('0.003');
	return deployer.deploy(GeneralPathProxy, dev, fee.toString(), owner, owner).then(res => {
		console.log('Constructor Parameters[0]: ' + dev);
		console.log('Constructor Parameters[1]: ' + fee.toString());
		console.log('Constructor Parameters[2]: ' + owner);
	});
};