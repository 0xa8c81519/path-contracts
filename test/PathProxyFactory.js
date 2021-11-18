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

	it('非Owner角色添加白名单，应该执行失败。', async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteList(contractAddress, { from: accounts[1] });
			assert.equal(1, 0, 'add white list success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("没有白名单数据时创建proxy，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			assert.equal(1, 0, 'create proxy success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:NO_WHITE_LIST)/);
		}
	});
	it('Owner添加白名单，应该执行成功。', async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteList(contractAddress);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, 'add white list failed!');
		}
	});
	it("给没有proxy的用户设置proxy的fee，应该执行失败。", async () => {
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
	it("给没有proxy的用户设置proxy的dev地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], accounts[1]);
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("给没有proxy的用户添加白名单，应该之行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], contractAddress);
			assert.equal(1, 0, "add white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("移除没有proxy的用户的白名单，应该执行失败。", async () => {
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
	it("为accounts[0]创建proxy，应该成功。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			logger.warn('Proxy creating success!');
		} catch (e) {
			assert.equal(1, 0, 'create proxy failed!');
			// logger.info(e.message);
		}
	});

	it("给0地址添加白名单，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser('0x0000000000000000000000000000000000000000', contractAddress);
			assert.equal(1, 0, "add white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("给accounts[0]的白名单中添加0地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], '0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, "add white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("给accounts[0]添加一个非0地址白名单，应该执行成功。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], accounts[2]);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "add white list failed !");
		}
	});
	it("再次给accounts[0]创建proxy，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.createProxy();
			assert.equal(1, 0, 'create proxy success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_ALREADY_HAS_A_PROXY)/);
		}
	});
	it('给全0地址设置fee为0.004，应该执行失败', async () => {
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
	it("设置accounts[0]的fee为0.004，应该执行成功。", async () => {
		let factory = await PathProxyFactory.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await factory.setFeeToUser(accounts[0], fee);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "set accounts[0]'s fee failed!");
		}
	});
	it("给全0地址用户设置dev地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser("0x0000000000000000000000000000000000000000", accounts[1]);
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("给accounts[0]的dev地址设置成全0地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], '0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:0_ADDRESS_CAN_T_BE_A_DEV)/);
		}
	});
	it("给没有proxy的用户accounts[1]设置dev地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[1], accounts[0]);
			assert.equal(1, 0, "set accounts[0]'s dev success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_HAVE_NOT_ANY_PROXY)/);
		}
	});
	it("给accounts[0]设置非0的dev地址，应该执行成功。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], accounts[1]);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "set accounts[0]'s dev failed!");
		}
	});
	it("移除白名单中的0地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'remove address 0 success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("移除一个不存在的白名单地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteList(accounts[1]);
			assert.equal(1, 0, 'remove address 0 success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_NOT_EXISTS)/);
		}
	});
	it("移除一个存在的非零白名单地址，应该执行成功。", async () => {
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
	it("移除0地址用户的白名单，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser('0x0000000000000000000000000000000000000000', contractAddress);
			assert.equal(1, 0, "remove white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:USER_MUST_NOT_0)/);
		}
	});
	it("移除accounts[0]白名单中的0地址，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], '0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, "remove white list success!");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("移除accounts[0]的白名单中的非0地址，应该执行成功。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], accounts[2]);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "remove white list failed !");
		}
	});
	it("非Owner调用转移factory，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryTo(contractAddress, { from: accounts[1] });
			assert.equal(1, 0, "transfer factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("非Owner调用转移指定用户的factory，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryToForUser(accounts[0], contractAddress, { from: accounts[1] });
			assert.equal(1, 0, "transfer factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("转移accounts[0]的factory地址到非0地址，应该执行成功。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryTo(contractAddress);
		} catch (e) {
			// logger.info(e.message);
			assert.equal(1, 0, "transfer factory failed !");
		}
	});
	it("非Factory地址调用转移factory，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.transferFactoryToForUser(accounts[0], contractAddress);
			assert.equal(1, 0, "transfer factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("非Factory调用proxy添加白名单，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.addWhiteListToUser(accounts[0], contractAddress);
			assert.equal(1, 0, "add white list factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("非Factory调用proxy移除白名单，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.removeWhiteListFromUser(accounts[0], contractAddress);
			assert.equal(1, 0, "remove white list factory success !");
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("非Factory设置proxy的fee，应该执行失败。", async () => {
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
	it("非Factory设置proxy的dev，应该执行失败。", async () => {
		let factory = await PathProxyFactory.deployed();
		try {
			await factory.setDevToUser(accounts[0], accounts[1]);
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
});