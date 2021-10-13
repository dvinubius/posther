import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../web3.service';
import { Post } from '../models/post.model';
import { combineLatest } from 'rxjs';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-viewer',
  templateUrl: './post-viewer.component.html',
  styleUrls: ['./post-viewer.component.scss'],
})
export class PostViewerComponent implements OnInit {
  postParagraphs: string[] = [];
  postDate = '';
  postAuthor = '';

  get pageError() {
    return (
      this.web3Svc.noMetamaskError ||
      this.web3Svc.noContractError ||
      this.postsSvc.postNotFoundError
    );
  }

  show = false;

  constructor(
    private route: ActivatedRoute,
    public web3Svc: Web3Service,
    public postsSvc: PostsService
  ) {}

  ngOnInit() {
    const rParams$ = this.route.params;
    const change$ = combineLatest([rParams$, this.web3Svc.web3Context$]);
    change$.subscribe(async ([p, ctx]) => {
      if (ctx.foundContract) {
        const post: Post | undefined = await this.postsSvc.getPostFromTx(
          p.txHash
        );
        if (!post) return;

        this.postParagraphs = post.text.split('\n');
        this.postDate = post.date.toLocaleString();
        this.postAuthor = post.author;
      }
    });

    setTimeout(() => (this.show = true), 100);
  }
}
