import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../web3.service';
import { Post } from '../models/post.model';
import { PostsService } from '../posts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-retrieve-post-page',
  templateUrl: './retrieve-post-page.component.html',
  styleUrls: ['./retrieve-post-page.component.scss'],
})
export class RetrievePostPageComponent implements OnInit {
  retrievedPost!: Post;
  inputTxHash = '';
  hasSubmitted = false;

  get canRetrieve() {
    return this.web3Svc.hasProvider && this.web3Svc.hasContract;
  }

  constructor(public web3Svc: Web3Service, public postsSvc: PostsService) {}

  ngOnInit() {
    this.postsSvc.resetPostRetrievalError();
  }

  private async retrieve(h: string) {
    const post: Post | undefined = await this.postsSvc.getPostFromTx(h);
    if (post) {
      this.retrievedPost = post;
    }
  }

  submit() {
    this.hasSubmitted = true;
    this.retrieve(this.inputTxHash);
  }
}
