import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import {
  Web3Service,
  Web3Context,
  Web3ErrorService,
  shortenAddress,
} from '../../web3';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavMenuService } from './nav-menu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
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

  sub = new Subscription();

  constructor(
    public web3Svc: Web3Service,
    public errorSvc: Web3ErrorService,
    private navMenuSvc: NavMenuService
  ) {}

  ngOnInit(): void {
    const navMenuSub = this.navMenuSvc.closeNavMenu$.subscribe(
      () => (this.navMenuOpened = false)
    );
    this.sub.add(navMenuSub);
    this.web3Ctx$ = this.web3Svc.web3Context$;
    this.balance$ = this.web3Svc.balance$.pipe(
      map((b) => `${b?.toFixed(4)} ETH` ?? '')
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
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
