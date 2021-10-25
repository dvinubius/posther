import { Injectable, NgZone } from '@angular/core';
import { Contract } from '@ethersproject/contracts';
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { ethers } from 'ethers';
import { getContract } from './contract';
import { environment } from 'src/environments/environment';
import detectEthereumProvider from '@metamask/detect-provider';
import { BehaviorSubject, Observable, from } from 'rxjs';
import * as evmChains from 'evm-chains';
import { Web3ErrorService, Web3Error } from './web3-error.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';

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
  private defaultProvider!: JsonRpcProvider;
  public ethPoster: Contract | null = null;
  public injectedProvider: Web3Provider | null = null;
  public signer: string | null = null;
  public deploymentBlockNo: number | null = null;

  public get provider(): Web3Provider | JsonRpcProvider | null {
    return this.injectedProvider || this.defaultProvider;
  }

  isInitialized = false;
  private _web3Context$ = new BehaviorSubject<Web3Context>({
    foundProvider: false,
    foundContract: false,
  });
  public web3Context$: Observable<Web3Context>;
  get balance$(): Observable<number | undefined> {
    return this.web3Context$.pipe(
      switchMap(async (ctx) => {
        if (!ctx.signer) return;
        if (!this.provider) return;
        const balanceBigNumber = await this.provider.getBalance(ctx.signer);
        const num = ethers.utils.formatEther(balanceBigNumber.toString());
        return +num;
      })
    );
  }

  get hasProvider() {
    return !!this.provider;
  }

  get hasContract() {
    return !!this.ethPoster;
  }

  constructor(private ngZone: NgZone, private errorSvc: Web3ErrorService) {
    this.web3Context$ = this._web3Context$.asObservable();
    this.init();
  }

  async init() {
    this.errorSvc.noDefaultProviderError = Web3Error.NO_DEFAULT_PROVIDER;
    this.errorSvc.noMetamaskError = Web3Error.NO_METAMASK;
    this.errorSvc.noSignerError = Web3Error.NO_ACCOUNT;
    this.errorSvc.noContractError = Web3Error.WRONG_NETWORK_NO_CONTRACT;
    await this.initDefaultProvider();
    await this.initInjectedProvider();
    this.isInitialized = true;
  }

  async initDefaultProvider() {
    this.defaultProvider = new ethers.providers.JsonRpcProvider(
      environment.defaultProviderUrl
    );
    try {
      this.defaultProvider
        .getNetwork()
        .then((v) => console.log('Found default network'));
      this.errorSvc.noDefaultProviderError = '';
      this._web3Context$.next({
        ...this._web3Context$.value,
        foundProvider: true,
      });

      await this.connectContract(this.defaultProvider);
    } catch (e) {
      console.error(Web3Error.NO_DEFAULT_PROVIDER);
    }
  }

  /**
   * Sets the provider to the injected one if there is already a connection available.
   * (User has previously connected an account via metamask with this app)
   * @returns
   */
  private async initInjectedProvider() {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const ethereum = (await detectEthereumProvider()) as any;
    if (!ethereum) {
      console.error(Web3Error.NO_METAMASK);
      return;
    }

    // We have a provider
    this.errorSvc.noMetamaskError = '';
    this.injectedProvider = new ethers.providers.Web3Provider(
      ethereum as ExternalProvider,
      'any' // this is needed in order for network change to be supported
    );
    console.log('Injected provider: ', this.injectedProvider);
    const network = await this.injectedProvider.getNetwork();
    this._web3Context$.next({
      ...this._web3Context$.value,
      foundProvider: true,
      chainId: network.chainId,
      networkName: this.printNetworkName(network),
    });
    await this.connectContract(this.injectedProvider);

    if (ethereum.selectedAddress) {
      await this.connectAccount(this.injectedProvider);
    }

    ethereum.on('chainChanged', async (_: any) => {
      // Reload may be useful when handling chain changes gets too complicated.
      // But reference frontends like the Uniswap interface manage without reloading.
      // The UX is clearly better this way.
      // window.location.reload();

      // external events like the ones from metamask trigger no change detection -> ngZone
      this.ngZone.run(async () => {
        if (!this.injectedProvider) {
          throw 'no web3 connection';
        }
        const network = await this.injectedProvider.getNetwork();
        this._web3Context$.next({
          ...this._web3Context$.value,
          chainId: network.chainId,
          networkName: this.printNetworkName(network),
        });
        await this.connectContract(this.injectedProvider);
      });
    });

    ethereum.on('accountsChanged', (accounts: string[]) => {
      // external events like the ones from metamask trigger no change detection -> ngZone
      this.ngZone.run(async () => {
        if (!this.injectedProvider) {
          return;
        }
        const signerAddress = accounts[0];
        console.log('ACCOUNT CHANGED: ', signerAddress);
        if (!signerAddress) {
          this.errorSvc.noSignerError = Web3Error.NO_ACCOUNT;
        }
        this.signer = signerAddress;
        this._web3Context$.next({
          ...this._web3Context$.value,
          signer: signerAddress,
        });
      });
    });
  }

  /**
   * Upon user action
   * @returns
   */
  public async userConnectAccount(): Promise<boolean> {
    if (!this.injectedProvider) {
      await this.initInjectedProvider();
    }
    if (!this.injectedProvider) {
      console.error(Web3Error.NO_METAMASK);
      return false;
    }
    const accountOk = await this.connectAccount(this.injectedProvider);
    if (!accountOk) {
      return false;
    }
    this.errorSvc.noMetamaskError = '';
    // metamask may be on another network. make sure our state is consistent
    await this.connectContract(this.injectedProvider);
    return true;
  }

  private async connectAccount(ethersProvider: Web3Provider): Promise<boolean> {
    this.signer = null;
    const ethereum = ethersProvider.provider as any; // injected provider

    if (!ethereum.selectedAddress) {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e: any) {
        if (e.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
          console.error(
            'User did not approve exposing their metamask accounts'
          );
          this.errorSvc.noSignerError = Web3Error.NO_ACCOUNT;
        } else if (e.code === -32002) {
          this.errorSvc.metamaskWaitingError = Web3Error.METAMASK_WAITING;
        } else {
          console.error(e);
        }
      }
    }

    const signer = ethereum.selectedAddress;
    if (!signer) {
      return false; // the user hasn't approved
    }
    this.signer = signer;
    console.log('Signer: ', signer);
    this.errorSvc.noSignerError = '';
    this._web3Context$.next({
      ...this._web3Context$.value,
      signer: signer,
    });
    return true;
  }

  async connectContract(
    ethersProvider: Web3Provider | JsonRpcProvider
  ): Promise<boolean> {
    this.ethPoster = null;
    this.deploymentBlockNo = null;
    // check network and contract
    const network = await ethersProvider.getNetwork();
    const targetNetworkId = environment.chainId;
    if (network.chainId !== targetNetworkId) {
      this.errorSvc.noContractError = Web3Error.WRONG_NETWORK_NO_CONTRACT;
      return false;
    }
    console.log(
      `Connected via provider at ${ethersProvider.connection.url} on network: `,
      this.printNetworkName(network),
      network.chainId
    );
    console.log('Retrieving Contract');
    const { abi, address, deploymentBlockNo } = getContract();
    this.deploymentBlockNo = deploymentBlockNo;
    this.ethPoster = new ethers.Contract(address, abi, ethersProvider);

    if (!this.ethPoster || !this.deploymentBlockNo) {
      const network = environment.contractNetwork;
      console.error(`Contract not found on ${network}`);
      this.errorSvc.noContractError = Web3Error.WRONG_NETWORK_NO_CONTRACT;
      return false;
    }

    console.log('Contract: ');
    console.log(this.ethPoster);
    this.errorSvc.noContractError = '';
    this._web3Context$.next({
      ...this._web3Context$.value,
      foundContract: true,
    });
    return true;
  }

  async isLocal() {
    return !environment.production;
  }

  private printNetworkName(network: ethers.providers.Network | undefined) {
    if (!network) return undefined;
    try {
      if (network.chainId === environment.chainId) {
        return environment.contractNetwork;
      }

      const chain: evmChains.IChainData = evmChains.getChainByChainId(
        network.chainId
      );
      return chain.name;
    } catch (e) {
      console.error(e);
      return 'unknown';
    }
  }
}
