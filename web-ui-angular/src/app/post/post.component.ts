import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  @Input() authorAddress!: string;
  @Input() date!: string;
  @Input() paragraphs!: string[];

  constructor() {}
}
