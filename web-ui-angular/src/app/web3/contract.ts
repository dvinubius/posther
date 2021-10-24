import { environment } from '../../environments/environment';

import * as contractJson from '../../../eth/deployed/contract.json';

export const getContract = () => {
  return {
    abi: contractJson.abi,
    address: environment.contractAddress,
    deploymentBlockNo: environment.blockNumber,
  };
};
