const PathProxyFactory = artifacts.require('PathProxyFactory');

module.exports = function (deployer, network, accounts) {
	let contractAddr = '0xa222e6a71D1A1Dd5F279805fbe38d5329C1d0e70';
	return PathProxyFactory.deployed().then(proxy => {
		return proxy.addWhiteList(contractAddr);
	}).catch(e => {
		console.log(e);
	});
};