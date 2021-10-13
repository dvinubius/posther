// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  contractNetwork: 'local ganache',
  chainId: 1337,
  contractAddress: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
  deploymentBlockNo: 1,
  defaultProviderUrl: 'http://localhost:8545',
  maxPostLength: 80000,
};
