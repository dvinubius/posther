import { Component, Input, OnChanges } from '@angular/core';
import { Posth } from '../../models/posth.model';

@Component({
  selector: 'app-retrieved-posth',
  templateUrl: './retrieved-posth.component.html',
  styleUrls: ['./retrieved-posth.component.scss'],
})
export class RetrievedPosthComponent implements OnChanges {
  @Input() post!: Posth;
  @Input() notFoundError = '';

  postParagraphs: string[] = [];
  postDate = '';
  postAuthor = '';

  constructor() {}

  ngOnChanges() {
    this.postParagraphs = this.post?.text?.split('\n');
    this.postDate = this.post?.date?.toLocaleString();
    this.postAuthor = this.post?.author;
  }
}
