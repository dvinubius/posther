import { Component, Input, OnInit } from '@angular/core';
import { Post, Web3Service } from '../web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  logs: Post[] | undefined;

  constructor(private web3Service: Web3Service) {}

  ngOnInit() {
    this.web3Service.getLogs().then((logs) => (this.logs = logs));
  }

  txLink(hash: string) {
    return `https://kovan.etherscan.io/address/${hash}`;
  }
}
