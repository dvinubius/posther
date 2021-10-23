import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-readable-posth',
  templateUrl: './readable-posth.component.html',
  styleUrls: ['./readable-posth.component.scss'],
})
export class ReadablePosthComponent {
  @Input() authorAddress!: string;
  @Input() date!: string;
  @Input() paragraphs!: string[];

  constructor() {}
}
