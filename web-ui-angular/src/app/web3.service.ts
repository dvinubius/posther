import { Injectable } from '@angular/core';
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { CD_STORAGE_ADDRESS, CD_STORAGE_ABI } from './contract';

export interface Post {
  txHash: string;
  blockNumber: number;
  storageCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  cdStorage: Contract | null = null;
  provider: Web3Provider | null = null;
  signer: Signer | null = null;

  constructor() {}

  async connect() {
    console.log(Object.keys(ethers));

    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
    this.signer = this.provider.getSigner();

    console.log('provider');
    console.log(this.provider);

    console.log('Signer');
    console.log(this.signer);

    console.log('Connected on ');
    console.log(await this.provider._networkPromise);

    this.cdStorage = new ethers.Contract(
      CD_STORAGE_ADDRESS,
      CD_STORAGE_ABI,
      this.provider
    );

    console.log('Contract: ');
    console.log(this.cdStorage);
  }

  async getLogs(): Promise<Post[]> {
    const currentBlock = await this.provider?.getBlockNumber();
    const filter = {
      address: CD_STORAGE_ADDRESS,
      fromBlock: 0,
      toBlock: currentBlock,
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        ethers.utils.id('PostCreated(uint256,string)'),
      ],
    };
    console.log('Retrieving logs... ');
    const logs = await this.provider?.getLogs(filter);
    console.log('Retrieved Logs in total: ', logs?.length);
    if (!logs) {
      return [];
    }
    return logs?.map((log) => {
      const text: string = ethers.utils.defaultAbiCoder.decode(
        ['uint256', 'string'],
        log.data
      )[1];
      const code = text.substr(text.lastIndexOf('/') + 1);

      return {
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        storageCode: code,
      };
    });
  }

  async getPostForCode(code: string): Promise<string> {
    return this.cdStorage?.getCalldataStorageEntry(code);
  }
}
