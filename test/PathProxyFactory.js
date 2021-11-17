const PathProxyFactory = artifacts.require("PathProxyFactory");
const HuaHuaToken = artifacts.require("HuaHuaToken");
const ethers = require('ethers');
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
			// logger.info(e.message);
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("no white list should create proxy failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			assert.equal(1, 0, 'create proxy success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:NO_WHITE_LIST)/);
		}
	});
	it('owner should add white list success.', async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteList(contractAddress);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, 'add white list failed!');
		}
	});
	it("setFee to user who haven't a proxy should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await factory.setFeeToUser(accounts[0], fee);
			assert.equal(1, 0, "set accounts[0]'s fee success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("setDev to user who haven't a proxy should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], accounts[1]);
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("add white list to who have no proxy should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], contractAddress);
			assert.equal(1, 0, "add white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("remove white list from who have no proxy should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], contractAddress);
			assert.equal(1, 0, "remove white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	// create proxy success.
	it("should create proxy success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			logger.warn('Proxy creating success!');
		} catch (e) {
			assert.equal(1, 0, 'create proxy failed!');
			// logger.info(e.message);
		}
	});

	it("add white list to address 0 should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser('0x0000000000000000000000000000000000000000', contractAddress);
			assert.equal(1, 0, "add white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("add address 0 to white list should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], '0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, "add white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("add contractAddress to accounts[0] should success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], accounts[2]);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "add white list failed !");
		}
	});
	it("user's address already exists should create proxy failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			assert.equal(1, 0, 'create proxy success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_ALREADY_HAS_A_PROXY)/);
		}
	});
	it('setFee use address 0 should failed.', async () => {
		let factory = await PathProxyFactory.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await factory.setFeeToUser("0x0000000000000000000000000000000000000000", fee);
			assert.equal(1, 0, "set accounts[0]'s fee success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("set accounts[0]'fee should success.", async () => {
		let factory = await PathProxyFactory.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await factory.setFeeToUser(accounts[0], fee);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "set accounts[0]'s fee failed!");
		}
	});
	it("set address 0's dev should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser("0x0000000000000000000000000000000000000000", accounts[1]);
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("set accounts[0]'s dev to address 0 should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], '0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:0_ADDRESS_CAN_T_BE_A_DEV)/);
		}
	});
	it("set dev who haven't any proxy should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[1], accounts[0]);
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("set accounts[0]'s dev should success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], accounts[1]);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "set accounts[0]'s dev failed!");
		}
	});
	it("should not remove address 0 from white list.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'remove address 0 success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("should not remove white list address which not exists.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList(accounts[1]);
			assert.equal(1, 0, 'remove address 0 success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_NOT_EXISTS)/);
		}
	});
	it("should remove white list success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList(contractAddress);
			let r = await factory.isWhiteListed(contractAddress);
			// logger.info("address exists in white list: " + r);
			assert.equal(false, r, "remove user's proxy failed.");
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, 'remove address failed!');
		}
	});
	it("remove address 0's white list should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser('0x0000000000000000000000000000000000000000', contractAddress);
			assert.equal(1, 0, "remove white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("remove address 0 from white list should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], '0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, "remove white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("remove contractAddress form accounts[0]'s proxy should success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], accounts[2]);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "remove white list failed !");
		}
	});
	it("no-owner call transferFactory should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryTo(contractAddress, { from: accounts[1] });
			assert.equal(1, 0, "transfer factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("no-owner call tranferFactoryToForUser should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryToForUser(accounts[0], contractAddress, { from: accounts[1] });
			assert.equal(1, 0, "transfer factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("accounts[0] transferFactory should success.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryTo(contractAddress);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "transfer factory failed !");
		}
	});
	it("accounts[0] transferFactoryToForUser should failed.", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryToForUser(accounts[0], contractAddress);
			assert.equal(1, 0, "transfer factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("no-factory call proxy's addWhiteList should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], contractAddress);
			assert.equal(1, 0, "add white list factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("no-factory call proxy's removeWhiteList should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], contractAddress);
			assert.equal(1, 0, "remove white list factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("no-factory call proxy's setFee should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await factory.setFeeToUser(accounts[0], fee);
			assert.equal(1, 0, "set fee factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("no-factory call proxy's setDev should failed", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], accounts[1]);
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
});