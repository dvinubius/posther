import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum Web3Error {
  NO_DEFAULT_PROVIDER = 'Could not connect to Ethereum. Please install a Metamask wallet.',
  NO_METAMASK = 'Could not find your wallet. Make sure you have Metamask installed.',
  NO_ACCOUNT = 'Please connect to a Metamask account.',
  WRONG_NETWORK_NO_CONTRACT = 'Make sure your Metamask is connected to the correct network.',
  NO_POST = `Post not found. Make sure the transaction hash is correct.`,
  METAMASK_WAITING = 'Please check your Metamask, a confirmation is pending.',
}

@Injectable({ providedIn: 'root' })
export class Web3ErrorService {
  get navbarStickyError(): string {
    return (
      this.noDefaultProviderError ||
      (this.noContractError
        ? `${this.noContractError} (${environment.contractNetwork})`
        : null) ||
      ''
    );
  }

  noDefaultProviderError: Web3Error | '' = '';
  noMetamaskError: Web3Error | '' = '';
  noSignerError: Web3Error | '' = '';
  noContractError: Web3Error | '' = '';
  metamaskWaitingError: Web3Error | '' = '';

  constructor() {}

  acknowledgeMetamaskWaiting() {
    this.metamaskWaitingError = '';
  }
}
