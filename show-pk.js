'use strict'

const ethers = require('ethers');
const mnemonics = require('./secret.js');

// 初始化rpc provider，浏览器中不需要
// const provider = new ethers.providers.JsonRpcProvider(config.default.rpc.url);
// 初始化助记词
const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonics.deployer);
// 初始化钱包
// const wallet = walletMnemonic.connect(provider);
console.log(walletMnemonic.address);
console.log(walletMnemonic.privateKey);