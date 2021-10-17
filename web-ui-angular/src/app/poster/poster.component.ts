import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from '../../environments/environment';
import { PostsService } from '../posts.service';
import { Web3Service } from '../web3.service';
import { Web3ErrorService } from '../web3-error.service';

export enum TxStatusText {
  PENDING = 'Transaction Pending',
  SUCCESS = 'Success!',
  FAILED = 'Transaction failed!',
  ERROR = 'An unfortunate error occured. However, your funds are #safu.',
}
@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.scss'],
})
export class PosterComponent implements OnInit {
  maxPostLength = environment.maxPostLength;
  inputText = '';
  txStatus: TxStatusText | '' = '';

  get cannotPostError() {
    return this.errorSvc.noMetamaskError || this.errorSvc.noSignerError;
  }

  get hasTxError() {
    return (
      this.txStatus === TxStatusText.ERROR ||
      Object.values(Error).includes(this.txStatus)
    );
  }

  constructor(
    private postSvc: PostsService,
    private web3Svc: Web3Service,
    private errorSvc: Web3ErrorService
  ) {}

  ngOnInit(): void {
    this.web3Svc.userConnectAccount();
  }

  async post() {
    const hasConnectedAccount = await this.web3Svc.userConnectAccount();
    if (!hasConnectedAccount) {
      return;
    }
    const tx: ethers.providers.TransactionResponse | undefined =
      await this.postSvc.post(this.inputText);
    if (!tx) {
      this.txStatus = TxStatusText.ERROR;
      return;
    }
    this.txStatus = TxStatusText.PENDING;
    await tx.wait();
    console.log('TX mined: ', tx.hash);
    this.txStatus = TxStatusText.SUCCESS;
  }
}
