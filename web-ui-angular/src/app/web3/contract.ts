import { environment } from '../../environments/environment';

import * as contractJson from '../../../web3-integration/contract.json';

export const getContract = () => {
  return {
    abi: contractJson.abi,
    address: environment.contractAddress,
    deploymentBlockNo: environment.blockNumber,
  };
};
