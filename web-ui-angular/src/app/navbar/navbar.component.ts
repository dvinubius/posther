import { Component, HostListener, OnInit } from '@angular/core';
import { Web3Service, Web3Context } from '../services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Web3ErrorService } from '../services/web3-error.service';
import { shortenAddress } from '../utils';
import { NavMenuService } from './nav-menu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  title = 'Posther';

  web3Ctx$!: Observable<Web3Context>;
  balance$!: Observable<string>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = window.innerWidth;
    if (!this.isSmallScreen) {
      this.navMenuOpened = false;
    }
  }
  width: number = window.innerWidth;
  navMenuOpened = false;
  get isSmallScreen() {
    return this.width <= 60 * 16;
  }
  get showPages() {
    return !this.isSmallScreen || this.navMenuOpened;
  }

  constructor(
    public web3Svc: Web3Service,
    public errorSvc: Web3ErrorService,
    private navMenuSvc: NavMenuService
  ) {}

  ngOnInit(): void {
    this.navMenuSvc.closeNavMenu$.subscribe(() => (this.navMenuOpened = false));
    this.web3Ctx$ = this.web3Svc.web3Context$;
    this.balance$ = this.web3Svc.balance$.pipe(
      map((b) => `${b?.toFixed(4)} ETH` ?? '')
    );
  }

  networkName(ctx: Web3Context) {
    return ctx.networkName ?? 'Not connected';
  }

  account(ctx: Web3Context) {
    return shortenAddress(ctx.signer ?? 'Connect Account');
  }

  connect(doConnect: boolean) {
    if (doConnect) {
      this.web3Svc.userConnectAccount();
    }
  }

  hideMetamaskWaitingError() {
    this.errorSvc.acknowledgeMetamaskWaiting();
  }

  toggleNavMenuOpened(evt: Event) {
    this.navMenuOpened = !this.navMenuOpened;
    evt.stopPropagation();
  }
}
