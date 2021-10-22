const chalk = require("chalk");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

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

  lipsumParagraphs: (n) => {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4,
      },
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });

    return lorem.generateParagraphs(n);
  },
};
