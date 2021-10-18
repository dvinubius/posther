import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { shortenAddress, shortenTxHash } from '../utils';

@Component({
  selector: 'app-explorable-hash',
  templateUrl: './explorable-hash.component.html',
  styleUrls: ['./explorable-hash.component.scss'],
})
export class ExplorableHashComponent implements OnChanges {
  readonly ADDRESS_LENGTH = 42;
  readonly TX_ID_LENGTH = 66;
  readonly BASE_URL = 'https://kovan.etherscan.io/address'; // TODO take from env

  @Input() hash = '';
  hashLink = '';
  shortHash = '';

  usedCopy = false;

  get copyIconKey(): string {
    return this.usedCopy ? 'done' : 'content_copy';
  }

  constructor() {}

  ngOnChanges(): void {
    this.shortHash =
      this.hash.length === this.ADDRESS_LENGTH
        ? shortenAddress(this.hash)
        : shortenTxHash(this.hash);
    this.hashLink = `${this.BASE_URL}/${this.hash}`;
  }

  copiedHash() {
    this.usedCopy = true;
    setTimeout(() => (this.usedCopy = false), 2000);
  }
}
