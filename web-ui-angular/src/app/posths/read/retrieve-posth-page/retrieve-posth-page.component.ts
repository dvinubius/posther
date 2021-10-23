import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../web3';
import { Posth } from '../../models/posth.model';
import { PostsService } from '../../service/posts.service';

@Component({
  selector: 'app-retrieve-posth-page',
  templateUrl: './retrieve-posth-page.component.html',
  styleUrls: ['./retrieve-posth-page.component.scss'],
})
export class RetrievePosthPageComponent implements OnInit {
  retrievedPost!: Posth;
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
    const post: Posth | undefined = await this.postsSvc.getPostFromTx(h);
    if (post) {
      this.retrievedPost = post;
    }
  }

  submit() {
    this.hasSubmitted = true;
    this.retrieve(this.inputTxHash);
  }
}
