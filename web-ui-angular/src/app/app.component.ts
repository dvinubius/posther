import { Component, OnInit } from '@angular/core';
import { Web3Service } from './web3.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'EthPoster';

  constructor(public web3Svc: Web3Service) {}
}
