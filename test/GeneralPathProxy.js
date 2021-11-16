const GeneralPathProxy = artifacts.require("GeneralPathProxy");
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
const logger = log4js.getLogger('GeneralPathProxy test case');

contract("GeneralPathProxy", accounts => {

	it("should add/remove white list success.", () => {
		return GeneralPathProxy.deployed()
			.then(proxy => {
				let contractAddr = '0x96cFA408CA039d9Afea0b8227be741Ef52e8a037';
				return proxy.addWhiteList(contractAddr).then(() => {
					return proxy.removeWhiteList(contractAddr).then(() => {
						return proxy.setDev(accounts[1]).then(() => {
							return proxy.setFee('300000000000000').then(() => {
								return proxy.transferFactoryTo(accounts[2]).then(() => {
									return proxy.withdrawETH().then(() => {
										HuaHuaToken.deployed().then(hht => {
											return proxy.withdraw(hht.address).then(() => {

											}).catch(e => {
												logger.info(e.message);
												assert.equal(1, 0, "withdraw failed!");
											});
										});
									}).catch(e => {
										logger.info(e.message);
										assert.equal(1, 0, "withdrawETH failed!");
									});
								}).catch(e => {
									logger.info(e.message);
									assert.equal(1, 0, "transferFactoryTo failed!");
								});
							}).catch(e => {
								logger.info(e.message);
								assert.equal(1, 0, "setFee failed!");
							});
						}).catch(e => {
							logger.info(e.message);
							assert.equal(1, 0, "setDev failed!");
						});
					}).catch(e => {
						logger.info(e.message);
						assert.equal(1, 0, "remove white list failed!");
					});
				}).catch(e => {
					logger.info(e.message);
					assert.equal(1, 0, "add white list failed!");
				});
			});
	});

	it("0 address and exists address should add/remove white list failed.", () => {
		return GeneralPathProxy.deployed()
			.then(proxy => {
				let contractAddr = '0x0000000000000000000000000000000000000000';
				return proxy.addWhiteList(contractAddr).then(res => {
					assert.equal(1, 0, "add white list success![1]");
				}).catch(e => {
					logger.info(e.message);
					return proxy.removeWhiteList('0x96cFA408CA039d9Afea0b8227be741Ef52e8a037').then(() => {
						assert.equal(1, 0, "remove white list success![2]");
					}).catch(e => {
						logger.info(e.message);
						return proxy.removeWhiteList(contractAddr).then(() => {
							assert.equal(1, 0, "remove white list success![3]");
						}).catch(e => {
							logger.info(e.message);
							return proxy.addWhiteList('0x96cFA408CA039d9Afea0b8227be741Ef52e8a037').then(() => {
								return proxy.addWhiteList('0x96cFA408CA039d9Afea0b8227be741Ef52e8a037').then(() => {
									assert.equal(1, 0, "add white list success![4]");
								});
							}).catch(e => {
								logger.info(e.message);
							});
						});
					});
				});
			});
	});

	it("other user (no-owner) should not run only owner method.", () => {
		return GeneralPathProxy.deployed().then(proxy => {
			let address = '0x96cFA408CA039d9Afea0b8227be741Ef52e8a037';
			return proxy.addWhiteList(address, { from: accounts[1] }).then(() => {
				assert.equal(1, 0, "No-owner can run addWhiteList.");
			}).catch(e => {
				logger.info(e.message);
				return proxy.removeWhiteList(address, { from: accounts[1] }).then(() => {
					assert.equal(1, 0, "No-owner can run removeWhiteList.");
				}).catch(e => {
					logger.info(e.message);
					return proxy.setFee('3000000000000000', { from: accounts[1] }).then(() => {
						assert.equal(1, 0, "No-owner can run setFee.");
					}).catch(e => {
						logger.info(e.message);
						return proxy.withdrawETH({ from: accounts[1] }).then(() => {
							assert.equal(1, 0, "No-owner can run withdrawETH.");
						}).catch(e => {
							logger.info(e.message);
							return proxy.withdraw('0x96cFA408CA039d9Afea0b8227be741Ef52e8a037', { from: accounts[1] }).then(() => {
								assert.equal(1, 0, "No-owner can run withdraw.");
							}).catch(e => {
								logger.info(e.message);
								return proxy.setDev('0x96cFA408CA039d9Afea0b8227be741Ef52e8a037', { from: accounts[1] }).then(() => {
									assert.equal(1, 0, "No-owner can run setDev.");
								}).catch(e => {
									logger.info(e.message);
									return proxy.transferFactoryTo('0x96cFA408CA039d9Afea0b8227be741Ef52e8a037', { from: accounts[1] }).then(() => {
										assert.equal(1, 0, "No-owner can run transferFactoryTo.");
									}).catch(e => {
										logger.info(e.message);
									});
								});
							});
						});
					});
				});
			});
		});
	});
});