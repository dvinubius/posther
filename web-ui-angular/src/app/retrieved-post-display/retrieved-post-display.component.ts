import { Component, Input, OnChanges } from '@angular/core';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-retrieved-post-display',
  templateUrl: './retrieved-post-display.component.html',
  styleUrls: ['./retrieved-post-display.component.scss'],
})
export class RetrievedPostDisplayComponent implements OnChanges {
  @Input() post!: Post;
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
