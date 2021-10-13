const ExecutorOfPath = artifacts.require('ExecutorOfPath');

module.exports = function (deployer, network, accounts) {
	let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	return ExecutorOfPath.deployed().then(executor => {
		return executor.addWhiteList(contractAddr);
	});
};