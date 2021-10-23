import { Injectable } from '@angular/core';

export enum TxStatusText {
  PENDING = 'Transaction Pending',
  SUCCESS = 'Success!',
  FAILED = 'Transaction failed!',
  ERROR = 'An unfortunate error occured.\nHowever, your funds are #safu.',
}

@Injectable({ providedIn: 'root' })
export class TxStatusService {
  public txStatus: TxStatusText | '' = '';
  public txHash = '';
  public txTitle = '';

  reset() {
    this.txStatus = '';
    this.txHash = '';
    this.txTitle = '';
  }
}
