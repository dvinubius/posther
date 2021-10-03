import { Component, OnInit, Input } from '@angular/core';
import { PostTransaction } from '../models/post-transaction.model';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() tx!: PostTransaction;

  get showLinkToEtherscan() {
    return !this.web3Svc.isLocal();
  }

  constructor(private web3Svc: Web3Service) {}

  ngOnInit(): void {}

  // only to be used with publicly deployed contracts
  txLink(hash: string) {
    return `https://kovan.etherscan.io/address/${hash}`;
  }

  dateForPostTx(tx: PostTransaction) {
    return new Date(tx.timestamp).toLocaleString();
  }
}
