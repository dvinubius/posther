const fs = require("fs");
module.exports = ({
  filePath,
  contractNetwork,
  contractAddress,
  blockNumber,
  defaultProviderUrl,
  chainId,
  etherscanUrl,
}) => {
  const envAsText = fs.readFileSync(filePath).toString();
  const lines = envAsText.split("\n");

  const contractNetworkLineIdx = lines.findIndex((l) =>
    l.includes("contractNetwork")
  );
  lines[contractNetworkLineIdx] = `contractNetwork: "${contractNetwork}",`;

  const addressLineIdx = lines.findIndex((l) => l.includes("contractAddress"));
  lines[addressLineIdx] = `contractAddress: "${contractAddress}",`;

  const chainIdLineIdx = lines.findIndex((l) => l.includes("chainId"));
  lines[chainIdLineIdx] = `chainId: ${chainId},`;

  const blockNoLineIdx = lines.findIndex((l) => l.includes("blockNumber"));
  lines[blockNoLineIdx] = `blockNumber: ${blockNumber},`;

  const providerIdx = lines.findIndex((l) => l.includes("defaultProviderUrl"));
  lines[providerIdx] = `defaultProviderUrl: "${defaultProviderUrl}",`;

  const etherscanUrlIdx = lines.findIndex((l) => l.includes("etherscanUrl"));
  lines[etherscanUrlIdx] = `etherscanUrl: "${etherscanUrl}",`;

  const newEnvAsText = lines.join("\n");
  fs.writeFileSync(filePath, newEnvAsText, { flag: "w" }, () => {});
};
