const PathProxyFactory = artifacts.require("PathProxyFactory");
const HuaHuaToken = artifacts.require("HuaHuaToken");
const log4js = require('log4js');
const log4jsConfig = {
	appenders: {
		stdout: {
			type: 'stdout',
			layout: {
				type: 'pattern',
				pattern: '%[[%d] [%p] [%f{2}:%l] %m'
			}
		},
	},
	categories: { default: { appenders: ["stdout"], level: "debug", enableCallStack: true } }
};
log4js.configure(log4jsConfig);
const logger = log4js.getLogger('PathProxyFactory test case');

let contractAddress = '0x96cFA408CA039d9Afea0b8227be741Ef52e8a037';

contract("PathProxyFactory", accounts => {

	it('no-owner should add white list failed.', async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteList(contractAddress, { from: accounts[1] });
			assert.equal(1, 0, 'add white list success!');
		} catch (e) {
			logger.info(e.message);
		}
	});
	it("no white list should create proxy failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			assert.equal(1, 0, 'create proxy success!');
		} catch (e) {
			logger.info(e.message);
		}
	});
	it('owner should add white list success.', async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteList(contractAddress);
		} catch (e) {
			logger.info(e.message);
			assert.equal(1, 0, 'add white list failed!');
		}
	});

	it("should create proxy success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
		} catch (e) {
			assert.equal(1, 0, 'create proxy failed!');
			logger.info(e.message);
		}
	});

	it("user's address already exists should create proxy failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			assert.equal(1, 0, 'create proxy success!');
		} catch (e) {
			logger.info(e.message);
		}
	});

	it("should not remove address 0 from white list.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'remove address 0 success!');
		} catch (e) {
			logger.info(e.message);
		}
	});
	it("should not remove white list address which not exists.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList(accounts[1]);
			assert.equal(1, 0, 'remove address 0 success!');
		} catch (e) {
			logger.info(e.message);
		}
	});
	it("should remove white list success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList(contractAddress);
			let r = await factory.isWhiteListed(contractAddress);
			logger.info("address exists in white list: " + r);
			assert.equal(false, r, "remove user's proxy failed.");
		} catch (e) {
			logger.info(e.message);
			assert.equal(1, 0, 'remove address failed!');
		}
	});
});