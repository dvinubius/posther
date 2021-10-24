const fs = require("fs");

module.exports = (networkName) => {
  const envFile = fs.readFileSync(`../.env`).toString();
  const m = `PROVIDER_URL_${networkName.toUpperCase()}`;
  const providerLine = envFile.split("\n").find((l) => l.includes(m));
  const equalsIdx = providerLine.indexOf("=");
  return providerLine.substr(equalsIdx + 1);
};
