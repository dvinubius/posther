import { Component, OnInit, Input } from '@angular/core';
import { PosthTx } from '../../models/posth-tx.model';
import { shortenTxHash, shortenAddress } from '../../../web3';

@Component({
  selector: 'app-posth-card',
  templateUrl: './posth-card.component.html',
  styleUrls: ['./posth-card.component.scss'],
})
export class PosthCardComponent implements OnInit {
  @Input() tx!: PosthTx;

  author = '';
  hash = '';
  date = '';
  txLink = '';
  authorLink = '';

  usedAuthorAddressCopy = false;
  usedTxHashCopy = false;

  get copyIconKeyAuthor(): string {
    return this.usedAuthorAddressCopy ? 'done' : 'content_copy';
  }

  get copyIconKeyTxHash(): string {
    return this.usedTxHashCopy ? 'done' : 'content_copy';
  }

  constructor() {}

  ngOnInit(): void {
    this.author = shortenAddress(this.tx.author);
    this.hash = shortenTxHash(this.tx.txHash);
    this.date = new Date(this.tx.timestamp).toLocaleString();
    const baseUrl = 'https://kovan.etherscan.io/address';
    this.txLink = `${baseUrl}/${this.tx.txHash}`;
    this.authorLink = `${baseUrl}/${this.tx.txHash}`;
  }

  copiedAuthor() {
    this.usedAuthorAddressCopy = true;
    setTimeout(() => (this.usedAuthorAddressCopy = false), 2000);
  }

  copiedTxHash() {
    this.usedTxHashCopy = true;
    setTimeout(() => (this.usedTxHashCopy = false), 2000);
  }
}
