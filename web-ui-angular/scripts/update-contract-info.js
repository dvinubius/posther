const fs = require("fs");
module.exports = (filePath, contractAddress, deploymentBlockNo) => {
  const envAsText = fs.readFileSync(filePath).toString();
  const lines = envAsText.split("\n");
  const addressLineIdx = lines.findIndex((l) => l.includes("contractAddress"));
  lines[addressLineIdx] = `contractAddress: "${contractAddress}",`;
  const blockNoLineIdx = lines.findIndex((l) =>
    l.includes("deploymentBlockNo")
  );
  lines[blockNoLineIdx] = `deploymentBlockNo: ${deploymentBlockNo},`;
  const newEnvAsText = lines.join("\n");
  fs.writeFileSync(filePath, newEnvAsText, { flag: "w" }, () => {});
};
