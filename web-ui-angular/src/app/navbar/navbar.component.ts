import { Component, OnInit } from '@angular/core';
import { Web3Service, Web3Context } from '../web3.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  title = 'EthPoster';

  web3Ctx$!: Observable<Web3Context>;

  constructor(private web3Svc: Web3Service) {}

  ngOnInit(): void {
    this.web3Ctx$ = this.web3Svc.web3Context$;
  }

  account(ctx: Web3Context) {
    return ctx.signer ?? 'Not Approved';
  }
}
