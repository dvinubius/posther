import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { Contract } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { getContract } from './contract';
import { environment } from 'src/environments/environment';
import { PostTransaction } from './models/post-transaction.model';
import { Post } from './models/post.model';
import detectEthereumProvider from '@metamask/detect-provider';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';

export enum Error {
  NO_PROVIDER = 'Could not connect to Ethereum. Make sure you have Metamask installed.',
  NO_ACCOUNT = 'Signing transactions requires your approval in Metamask.',
  WRONG_NETWORK_NO_CONTRACT = 'Make sure your Metamask is connected to the correct network.',
  NO_POST = `Post not found. Make sure the transaction hash is correct.`,
}

export interface Web3Context {
  foundProvider: boolean;
  chainId?: number;
  networkName?: string;
  foundContract: boolean;
  signer?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private ethPoster!: Contract;
  private provider!: Web3Provider;
  private signer!: Signer;
  private deploymentBlockNo!: number;

  private _web3Context$ = new BehaviorSubject<Web3Context>({
    foundProvider: false,
    foundContract: false,
  });
  public web3Context$: Observable<Web3Context>;

  private _noProviderError: string = Error.NO_PROVIDER;
  get noProviderError() {
    return this._noProviderError;
  }

  private _noSignerError: string = Error.NO_ACCOUNT;
  get noSignerError() {
    return this._noSignerError;
  }

  private _noContractError: string = Error.WRONG_NETWORK_NO_CONTRACT;
  get noContractError() {
    return this._noContractError;
  }

  private _postNotFoundError: string = Error.NO_POST;
  get postNotFoundError() {
    return this._postNotFoundError;
  }

  constructor(private ngZone: NgZone) {
    this.web3Context$ = this._web3Context$.asObservable();
    this.initProvider();
  }

  async initProvider() {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const ethereum = (await detectEthereumProvider()) as any;
    if (!ethereum) {
      console.error('Could not establish ethereum provider');
      return;
    }

    // We have a provider
    this._noProviderError = '';
    this.provider = new ethers.providers.Web3Provider(
      ethereum as ExternalProvider,
      'any' // this is needed in order for network change to be supported
    );
    console.log('Provider: ', this.provider);
    const network = await this.provider.getNetwork();
    this._web3Context$.next({
      ...this._web3Context$.value,
      foundProvider: true,
      chainId: network.chainId,
      networkName: network.name,
    });

    await this.connectContract();
    await this.connectAccounts();

    ethereum.on('chainChanged', async (_: any) => {
      // Reload may be useful when handling chain changes gets too complicated.
      // But reference frontends like the Uniswap interface manage without reloading.
      // The UX is clearly better this way.
      // window.location.reload();

      // external events like the ones from metamask trigger no change detection -> ngZone
      this.ngZone.run(async () => {
        const network = await this.provider.getNetwork();
        this._web3Context$.next({
          ...this._web3Context$.value,
          chainId: network.chainId,
          networkName: network.name,
        });
        this.connectContract();
        this.connectAccounts();
      });
    });
  }

  async connectAccounts() {
    this._noSignerError = '';
    const ethereum = this.provider.provider as any;
    await ethereum.enable();

    this.signer = this.provider.getSigner();
    if (!this.signer) {
      console.error('User did not approve exposing their metamask accounts');
      this._noSignerError = Error.NO_ACCOUNT;
    }
    console.log('Signer: ', await this.signer.getAddress());
    this._web3Context$.next({
      ...this._web3Context$.value,
      signer: await this.signer.getAddress(),
    });
  }

  async connectContract() {
    this._noContractError = '';
    // check network and contract
    const network = await this.provider.getNetwork();
    const targetNetworkId = environment.chainId;
    if (network.chainId !== targetNetworkId) {
      this._noContractError = `${Error.WRONG_NETWORK_NO_CONTRACT} (${environment.contractNetwork})`;
      return;
    }

    console.log('Connected via Metamask on: ', network.name, network.chainId);
    const { abi, address, deploymentBlockNo } = getContract();
    this.deploymentBlockNo = deploymentBlockNo;
    this.ethPoster = new ethers.Contract(address, abi, this.provider);

    if (!this.ethPoster || !this.deploymentBlockNo) {
      const network = environment.contractNetwork;
      console.error(`Contract not found on ${network}`);
      this._noContractError = `${Error.WRONG_NETWORK_NO_CONTRACT} (${network})`;
      return;
    }

    console.log('Contract: ');
    console.log(this.ethPoster);
    this._web3Context$.next({
      ...this._web3Context$.value,
      foundContract: true,
    });
  }

  async isLocal() {
    return !environment.production;
  }

  async getPosts(): Promise<PostTransaction[]> {
    this.assertProviderConnected();
    this.assertContractAvailable();
    const latestBlockNo = await this.provider.getBlockNumber();
    const contractAddr = this.ethPoster.address;
    const deploymentBlockNo = this.deploymentBlockNo;
    console.log('Retrieving post transactions... ');
    const parsedPostTxs = await this.getParsedTxsWithTimestamps(
      deploymentBlockNo,
      latestBlockNo,
      contractAddr
    );
    return parsedPostTxs.map((parsedTx) => ({
      ...parsedTx,
      text: parsedTx.args[0],
    }));
  }

  private async getParsedTxsWithTimestamps(
    deploymentBlockNo: number,
    latestBlockNo: number,
    contractAddr: string,
    getOnlyMyOwn = false
  ) {
    if (getOnlyMyOwn) {
      this.assertAccountConnected();
    }
    const parsedPostTxs: any[] = [];
    for (let i = deploymentBlockNo; i <= latestBlockNo; i++) {
      const block = await this.provider.getBlockWithTransactions(i);
      for (let tx of block.transactions ?? []) {
        const senderOk = getOnlyMyOwn
          ? tx.from === (await this.signer.getAddress()) // TODO can be improved to match any of the connected wallet's accounts
          : true;
        const isCandidate = tx.to === contractAddr && senderOk;
        if (!isCandidate) continue;
        const parsedTx = this.ethPoster.interface.parseTransaction({
          data: tx.data,
          value: tx.value,
        });
        if (parsedTx.functionFragment.name === 'post')
          parsedPostTxs.push({
            ...parsedTx,
            blockNumber: i,
            timestamp: block?.timestamp * 1000,
            txHash: tx.hash,
          });
      }
    }
    return parsedPostTxs;
  }

  async getPostFromTx(txHash: string): Promise<Post | null> {
    this.assertProviderConnected();
    this._postNotFoundError = '';
    const txResp = await this.provider.getTransaction(txHash);
    if (!txResp) {
      this._postNotFoundError = Error.NO_POST;
      return null;
    }
    const timestamp = await this.getTimestampForTx(txResp);
    const parsed = this.ethPoster.interface.parseTransaction({
      data: txResp.data,
      value: txResp.value,
    });
    return {
      text: parsed.args[0],
      date: new Date(timestamp),
    };
  }

  private async getTimestampForTx(
    txResp: ethers.providers.TransactionResponse
  ) {
    const blockNumber = txResp.blockNumber;
    if (!blockNumber) {
      throw 'Passed txResponse has no block number';
    }
    const block = await this.provider?.getBlock(blockNumber);
    if (!block) {
      throw 'Could not retrieve block by number';
    }
    return block.timestamp * 1000;
  }

  private assertProviderConnected() {
    if (!this.provider) throw 'no web3 connection';
  }

  private assertContractAvailable() {
    if (!this.ethPoster) throw 'no contract available';
  }

  private assertAccountConnected() {
    if (!this.signer) throw 'no web3 account connected';
  }
}
