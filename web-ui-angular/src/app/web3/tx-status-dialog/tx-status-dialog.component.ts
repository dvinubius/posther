import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TxStatusService, TxStatusText } from '../tx-status-service';

@Component({
  selector: 'app-tx-status-dialog',
  templateUrl: './tx-status-dialog.component.html',
  styleUrls: ['./tx-status-dialog.component.scss'],
})
export class TxStatusDialogComponent implements OnInit {
  get title(): string {
    return this.txStatusSvc.txTitle;
  }

  get txStatus(): TxStatusText | '' {
    return this.txStatusSvc.txStatus;
  }

  get txHash() {
    return this.txStatusSvc.txHash;
  }

  get hashLink() {
    return `${environment.etherscanUrl}/tx/${this.txHash}`;
  }

  get hasTxError() {
    return (
      this.txStatus === TxStatusText.ERROR ||
      Object.values(Error).includes(this.txStatus)
    );
  }

  get isPending(): boolean {
    return this.txStatus === TxStatusText.PENDING;
  }

  get isSuccessful(): boolean {
    return this.txStatus === TxStatusText.SUCCESS;
  }

  get isError(): boolean {
    return this.txStatus === TxStatusText.ERROR;
  }

  usedCopy = false;

  get copyIconKey(): string {
    return this.usedCopy ? 'done' : 'content_copy';
  }

  constructor(
    private txStatusSvc: TxStatusService,
    private ref: MatDialogRef<TxStatusDialogComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {}

  close() {
    this.ref.close();
  }

  navigateToRead() {
    this.ref.close();
    this.router.navigate(['/read', this.txHash]);
  }

  copiedId() {
    this.usedCopy = true;
    setTimeout(() => (this.usedCopy = false), 2000);
  }
}
