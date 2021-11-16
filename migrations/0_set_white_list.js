const ExecutorOfPath = artifacts.require('ExecutorOfPath');

module.exports = function (deployer, network, accounts) {
	let contractAddr = '0x96cFA408CA039d9Afea0b8227be741Ef52e8a037';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	// let contractAddr = '';
	return ExecutorOfPath.deployed().then(executor => {
		return executor.addWhiteList(contractAddr);
	}).catch(e => {
		console.log(e);
	});
};