const chalk = require("chalk");

module.exports = {
  printBalance: async (hre, addr) => {
    const balanceAsWei = await hre.ethers.provider.getBalance(addr);
    const balanceAsEth = hre.ethers.utils.formatEther(balanceAsWei);
    console.log(`Balance: ${chalk.cyan(balanceAsEth)} ETH `);
  },

  colAddrEOA: (address) => chalk.yellow(address),

  colAddrContract: (address) => chalk.green(address),

  colAmt: (amt) => chalk.cyan(amt),

  colTX: (txHash) => chalk.bgMagenta(txHash),

  colPath: (path) => chalk.bgBlue(path),
};
