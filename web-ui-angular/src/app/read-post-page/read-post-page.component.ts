import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../services';
import { PostsService } from '../posts.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-read-post-page',
  templateUrl: './read-post-page.component.html',
  styleUrls: ['./read-post-page.component.scss'],
})
export class ReadPostPageComponent implements OnInit {
  retrievedPost!: Post;

  constructor(
    private activatedRoute: ActivatedRoute,
    public web3Svc: Web3Service,
    public postsSvc: PostsService
  ) {}

  ngOnInit() {
    this.postsSvc.resetPostRetrievalError();
    const p = this.activatedRoute.snapshot.params;
    if (!this.web3Svc.hasProvider || this.web3Svc.hasContract) {
      this.retrieveFor(p.txHash);
    }
  }

  private async retrieveFor(h: string) {
    const post: Post | undefined = await this.postsSvc.getPostFromTx(h);
    if (post) {
      this.retrievedPost = post;
    }
  }
}
