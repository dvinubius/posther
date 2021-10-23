import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../../../web3';
import { PostsService } from '../../service/posts.service';
import { Posth } from '../../models/posth.model';

@Component({
  selector: 'app-read-posth-page',
  templateUrl: './read-posth-page.component.html',
  styleUrls: ['./read-posth-page.component.scss'],
})
export class ReadPosthPageComponent implements OnInit {
  retrievedPost!: Posth;

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
    const post: Posth | undefined = await this.postsSvc.getPostFromTx(h);
    if (post) {
      this.retrievedPost = post;
    }
  }
}
