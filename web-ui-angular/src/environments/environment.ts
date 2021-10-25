// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  contractNetwork: 'local ganache',
  chainId: 1337,
  contractAddress: '0xD86C8F0327494034F60e25074420BcCF560D5610',
  blockNumber: 14484,
  defaultProviderUrl: 'http://localhost:8545',
  etherscanUrl: 'https://etherscan.io',
  maxPostLength: 80000,
};
