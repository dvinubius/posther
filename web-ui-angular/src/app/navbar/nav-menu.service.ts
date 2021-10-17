import { EventEmitter, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavMenuService {
  closeNavMenu$ = new EventEmitter();

  constructor() {}

  closeMenu() {
    this.closeNavMenu$.emit();
  }
}
