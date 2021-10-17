import { HostBinding, OnInit } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
export const jazzicon = require('@metamask/jazzicon');
export const MersenneTwister = require('mersenne-twister');

@Component({
  selector: 'app-jazzicon',
  templateUrl: './jazzicon.component.html',
  styleUrls: ['./jazzicon.component.scss'],
})
export class JazziconComponent implements OnInit, AfterViewInit {
  @Input('seed') seed!: string | number;
  @Input('size') size: number = 100;
  @ViewChild('jazziconElement', { static: true }) jazziconElement!: ElementRef;
  @Input('wrapped') wrapped = false;

  jazzyStyle: any;

  @HostBinding('class.wrapped') get isWrapped(): boolean {
    return this.wrapped;
  }

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.jazzyStyle = {
      height: `${this.size}px`,
      lineHeight: `${this.size}px`,
    };
  }

  ngAfterViewInit(): void {
    let seedInteger = this.seed;
    if (typeof this.seed === 'string') {
      seedInteger = JazziconComponent.jsNumberForAddress(this.seed);
    }
    const value = jazzicon(this.size, seedInteger);
    this.renderer.appendChild(this.jazziconElement.nativeElement, value);
  }

  private static jsNumberForAddress(address: string) {
    const addr = address.toLowerCase().slice(2, 10);
    return parseInt(addr, 16);
  }
}
