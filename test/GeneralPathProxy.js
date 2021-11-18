const GeneralPathProxy = artifacts.require("GeneralPathProxy");
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
const logger = log4js.getLogger('GeneralPathProxy test case');

let contractAddress = '0x96cFA408CA039d9Afea0b8227be741Ef52e8a037';

contract("GeneralPathProxy", accounts => {
	it("添加非0的新地址到白名单，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.addWhiteList(contractAddress);
		} catch (e) {
			assert.equal(1, 0, 'add white list success!');
		}
	});
	it("添加0地址到白名单，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.addWhiteList('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'add white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("添加已存在地址到白名单，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.addWhiteList(contractAddress);
			assert.equal(1, 0, 'add white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ADDRESS_ALREADY_EXISTS)/);
		}
	});
	it("非Factory添加已存在地址到白名单，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.addWhiteList(contractAddress, { from: accounts[1] });
			assert.equal(1, 0, 'add white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("从白名单中移除0地址，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.removeWhiteList('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'remove white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ADDRESS_CAN_T_BE_0)/);
		}
	});
	it("从白名单中移除不存在的地址，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.removeWhiteList(accounts[1]);
			assert.equal(1, 0, 'remove white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ADDRESS_NOT_EXISTS)/);
		}
	});
	it("从白名单中移除已存在的地址，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.removeWhiteList(contractAddress);
		} catch (e) {
			assert.equal(1, 0, 'remove white list failed!');
		}
	});
	it("非Factory从白名单中移除不存在的地址，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.removeWhiteList(contractAddress, { from: accounts[1] });
			assert.equal(1, 0, 'remove white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("非Factory设置fee，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await proxy.setFee(fee, { from: accounts[1] });
			assert.equal(1, 0, 'remove white list success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("Factory设置fee，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		let fee = ethers.utils.parseEther('0.004');
		try {
			await proxy.setFee(fee);
		} catch (e) {
			assert.equal(1, 0, 'set fee failed!');
		}
	});
	it("非Owner提取eth，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.withdrawETH({ from: accounts[1] });
			assert.equal(1, 0, 'success!');
		} catch (e) {
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("Owner提取eth，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.withdrawETH();
		} catch (e) {
			assert.equal(1, 0, 'failed !');
		}
	});
	it("非Owner提取token，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		let hht = await HuaHuaToken.deployed();
		try {
			await proxy.withdraw(hht.address, { from: accounts[1] });
			assert.equal(1, 0, 'success!');
		} catch (e) {
			expect(e.message).to.match(/(?:caller is not the owner)/);
		}
	});
	it("Owner提取0地址token，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.withdraw('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'success!');
		} catch (e) {
			expect(e.message).to.match(/(?:TOKEN_MUST_NOT_BE_0)/);
		}
	});
	it("Owner提取非0地址token，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		let hht = await HuaHuaToken.deployed();
		try {
			await proxy.withdraw(hht.address);
		} catch (e) {
			assert.equal(1, 0, 'failed!');
		}
	});
	it("设置dev地址为0地址，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.setDev('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'success!');
		} catch (e) {
			expect(e.message).to.match(/(?:0_ADDRESS_CAN_T_BE_A_DEV)/);
		}
	});
	it("非Factory设置dev为非0地址，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.setDev(accounts[1], { from: accounts[1] });
			assert.equal(1, 0, 'success!');
		} catch (e) {
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("Factory设置dev为非0地址，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.setDev(accounts[1]);
		} catch (e) {
			assert.equal(1, 0, 'failed!');
		}
	});
	it("转移factory到0地址，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.transferFactoryTo('0x0000000000000000000000000000000000000000');
			assert.equal(1, 0, 'success!');
		} catch (e) {
			expect(e.message).to.match(/(?:FACTORY_CAN_T_BE_0)/);
		}
	});
	it("非Factory转移factory，应该执行失败。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.transferFactoryTo(accounts[1], { from: accounts[1] });
			assert.equal(1, 0, 'success!');
		} catch (e) {
			// logger.info(e.message);
			expect(e.message).to.match(/(?:ONLY_FACTORY)/);
		}
	});
	it("Factory转移factory，应该执行成功。", async () => {
		let proxy = await GeneralPathProxy.deployed();
		try {
			await proxy.transferFactoryTo(accounts[1]);
		} catch (e) {
			assert.equal(1, 0, 'failed!');
		}
	});
});