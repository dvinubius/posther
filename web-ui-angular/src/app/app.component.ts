import { Component, HostListener, OnInit } from '@angular/core';
import { Web3ErrorService } from './services/web3-error.service';
import { Web3Service } from './services';
import { NavMenuService } from './navbar/nav-menu.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Posther';

  @HostListener('click') onClicks() {
    this.navMenuSvc.closeMenu();
  }
  constructor(
    public web3Svc: Web3Service,
    public errorSvc: Web3ErrorService,
    private navMenuSvc: NavMenuService
  ) {}
}
