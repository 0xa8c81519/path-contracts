const ExecutorOfPath = artifacts.require('ExecutorOfPath');
const ehters = require('ethers');

module.exports = function (deployer, network, accounts) {
    let dev = accounts[0];
    let owner = accounts[0];
    let fee = ehters.utils.parseEther('0.003');
    return deployer.deploy(ExecutorOfPath, dev, fee.toString(), owner).then(res => {
        console.log('Constructor Parameters[0]: ' + dev);
        console.log('Constructor Parameters[1]: ' + fee.toString());
        console.log('Constructor Parameters[2]: ' + owner);
    });
};