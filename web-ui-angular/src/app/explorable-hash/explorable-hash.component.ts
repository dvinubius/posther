import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { isAddress } from '@ethersproject/address';
import { environment } from 'src/environments/environment';
import { shortenAddress, shortenTxHash } from '../utils';

@Component({
  selector: 'app-explorable-hash',
  templateUrl: './explorable-hash.component.html',
  styleUrls: ['./explorable-hash.component.scss'],
})
export class ExplorableHashComponent implements OnChanges {
  readonly ADDRESS_LENGTH = 42;
  readonly TX_ID_LENGTH = 66;

  @Input() hash = '';
  @Input() hideHash = false;
  hashLink = '';
  shortHash = '';

  usedCopy = false;

  get copyIconKey(): string {
    return this.usedCopy ? 'done' : 'content_copy';
  }

  constructor() {}

  ngOnChanges(): void {
    const isAddress = this.hash.length === this.ADDRESS_LENGTH;
    this.shortHash = isAddress
      ? shortenAddress(this.hash)
      : shortenTxHash(this.hash);
    const route = isAddress ? 'address' : 'tx';
    this.hashLink = `${environment.etherscanUrl}/${route}/${this.hash}`;
  }

  copiedHash() {
    this.usedCopy = true;
    setTimeout(() => (this.usedCopy = false), 2000);
  }
}
