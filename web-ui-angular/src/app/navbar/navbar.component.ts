import { Component, OnInit } from '@angular/core';
import { Web3Service, Web3Context } from '../web3.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  title = 'EthPoster';

  web3Ctx$!: Observable<Web3Context>;

  get isInitialized() {
    return this.web3Svc.isInitialized;
  }

  constructor(private web3Svc: Web3Service) {}

  ngOnInit(): void {
    this.web3Ctx$ = this.web3Svc.web3Context$;
    // .pipe(tap((v) => console.log(v)));
  }

  networkName(ctx: Web3Context) {
    return ctx.networkName ?? 'Not connected';
  }

  account(ctx: Web3Context) {
    return ctx.signer ?? 'Connect Account';
  }

  connect(doConnect: boolean) {
    if (doConnect) {
      this.web3Svc.userConnectAccount();
    }
  }
}
