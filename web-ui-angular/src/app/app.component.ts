import { Component, OnInit } from '@angular/core';
import { Web3Service } from './web3.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'EthPoster';

  get isInitialized() {
    return this.web3Svc.isInitialized;
  }

  get hasNoProvider() {
    return this.web3Svc.noDefaultProviderError && this.web3Svc.noMetamaskError;
  }

  get noProviderError() {
    return this.web3Svc.noDefaultProviderError;
  }

  constructor(public web3Svc: Web3Service) {}
}
