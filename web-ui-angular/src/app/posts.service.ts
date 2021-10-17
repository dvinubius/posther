import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { PostTransaction } from './models/post-transaction.model';
import { ethers } from 'ethers';
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Post } from './models/post.model';
import { Web3Error } from './web3-error.service';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private _postNotFoundError: string = Web3Error.NO_POST;
  get postNotFoundError() {
    return this._postNotFoundError;
  }

  constructor(public web3Svc: Web3Service) {}
  async getMostRecentPosts(
    howMany: number,
    getOnlyMyOwn = false
  ): Promise<PostTransaction[] | undefined> {
    if (!this.web3Svc.provider) {
      console.error(
        Web3Error.NO_DEFAULT_PROVIDER + '\n' + Web3Error.NO_METAMASK
      );
      // no provider at all - nothing we can do
      return;
    }
    if (getOnlyMyOwn && !this.web3Svc.signer) {
      console.error(Web3Error.NO_ACCOUNT);
      // no known signer, to retrieve account-specific posts - nothing we can do
      return;
    }
    if (!this.web3Svc.ethPoster || !this.web3Svc.deploymentBlockNo) {
      console.error(Web3Error.WRONG_NETWORK_NO_CONTRACT);
      return;
    }
    const latestBlockNo = await this.web3Svc.provider.getBlockNumber();
    const contractAddr = this.web3Svc.ethPoster.address;
    const deploymentBlockNo = this.web3Svc.deploymentBlockNo;
    let isMatch;
    if (getOnlyMyOwn) {
      if (!this.web3Svc.signer) {
        console.error(Web3Error.NO_ACCOUNT);
        return;
      }
      const signerAddress = this.web3Svc.signer;
      isMatch = (tx: ethers.providers.TransactionResponse) =>
        tx.to === contractAddr &&
        tx.from.toLowerCase() === signerAddress.toLowerCase(); // ganache cli changes some letters' cases when printing private keys to a file
    } else {
      isMatch = (tx: ethers.providers.TransactionResponse) =>
        tx.to === contractAddr;
    }

    console.log('Retrieving post transactions... ');
    const parsedPostTxs = await this.getParsedTxsWithTimestamps(
      this.web3Svc.provider,
      deploymentBlockNo,
      latestBlockNo,
      isMatch,
      howMany
    );
    return parsedPostTxs.map((parsedTx) => ({
      ...parsedTx,
      text: parsedTx.args[0],
    }));
  }

  private async getParsedTxsWithTimestamps(
    provider: Web3Provider | JsonRpcProvider,
    deploymentBlockNo: number,
    latestBlockNo: number,
    isMatch: (tx: ethers.providers.TransactionResponse) => boolean,
    howMany: number
  ) {
    const parsedPostTxs: any[] = [];
    for (
      let i = latestBlockNo;
      i >= deploymentBlockNo && parsedPostTxs.length < howMany;
      i--
    ) {
      const block = await provider.getBlockWithTransactions(i);
      for (let tx of block.transactions ?? []) {
        if (!isMatch(tx)) continue;
        const parsedTx = this.web3Svc.ethPoster?.interface.parseTransaction({
          data: tx.data,
          value: tx.value,
        });
        if (parsedTx?.functionFragment.name === 'post')
          parsedPostTxs.push({
            ...parsedTx,
            author: tx.from,
            blockNumber: i,
            timestamp: block.timestamp * 1000,
            txHash: tx.hash,
          });
      }
    }
    return parsedPostTxs;
  }

  async getPostFromTx(txHash: string): Promise<Post | undefined> {
    if (!this.web3Svc.injectedProvider) {
      console.error(Web3Error.NO_METAMASK);
      return;
    }
    if (!this.web3Svc.ethPoster || !this.web3Svc.deploymentBlockNo) {
      console.error(Web3Error.WRONG_NETWORK_NO_CONTRACT);
      return;
    }
    this._postNotFoundError = '';
    let txResp;
    try {
      txResp = await this.web3Svc.injectedProvider.getTransaction(txHash);
    } catch (e) {
      console.log(e);
    }
    if (!txResp) {
      this._postNotFoundError = Web3Error.NO_POST;
      return;
    }
    const timestamp = await this.getTimestampForTx(txResp);
    const parsed = this.web3Svc.ethPoster.interface.parseTransaction({
      data: txResp.data,
      value: txResp.value,
    });
    return {
      text: parsed.args[0],
      date: new Date(timestamp),
      author: txResp.from,
    };
  }

  private async getTimestampForTx(
    txResp: ethers.providers.TransactionResponse
  ) {
    const blockNumber = txResp.blockNumber;
    if (!blockNumber) {
      throw 'Passed txResponse has no block number';
    }
    const block = await this.web3Svc.injectedProvider?.getBlock(blockNumber);
    if (!block) {
      throw 'Could not retrieve block by number';
    }
    return block.timestamp * 1000;
  }

  async post(
    text: string
  ): Promise<ethers.providers.TransactionResponse | undefined> {
    if (!this.web3Svc.injectedProvider) {
      console.error(Web3Error.NO_METAMASK);
      return;
    }
    if (!this.web3Svc.ethPoster || !this.web3Svc.deploymentBlockNo) {
      console.error(Web3Error.WRONG_NETWORK_NO_CONTRACT);
      return;
    }
    if (!this.web3Svc.signer) {
      console.error(Web3Error.NO_ACCOUNT);
      return;
    }
    const fee = await this.web3Svc.ethPoster.fee();
    const signer = this.web3Svc.provider?.getSigner();
    if (!signer) {
      console.error(Web3Error.NO_ACCOUNT);
      return;
    }
    const tx = await this.web3Svc.ethPoster
      .connect(signer)
      .post(text, { value: fee });
    console.log('Post TX sent with: ', text);
    return tx;
  }
}
