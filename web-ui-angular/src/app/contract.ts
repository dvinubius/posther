import { environment } from '../environments/environment';

import * as contractJson from '../../../artifacts/contracts/EthPoster.sol/EthPoster.json';

export const getContract = () => {
  return {
    abi: contractJson.abi,
    address: environment.contractAddress,
    deploymentBlockNo: environment.deploymentBlockNo,
  };
};
