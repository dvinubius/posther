import { Component, OnInit } from '@angular/core';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'web-ui-angular';
  connected = false;
  error = '';

  constructor(private web3Svc: Web3Service) {}

  ngOnInit() {
    this.web3Svc.connect().then(
      () => (this.connected = true),
      () => {
        this.error = 'Could not connect to your browser wallet';
      }
    );
  }
}
