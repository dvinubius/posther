import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../web3.service';
import { Post } from '../models/post.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-post-viewer',
  templateUrl: './post-viewer.component.html',
  styleUrls: ['./post-viewer.component.scss'],
})
export class PostViewerComponent implements OnInit {
  postText = '';
  postDate = '';

  get pageError() {
    return (
      this.web3Svc.noProviderError ||
      this.web3Svc.noContractError ||
      this.web3Svc.postNotFoundError
    );
  }

  show = false;

  constructor(private route: ActivatedRoute, public web3Svc: Web3Service) {}

  ngOnInit() {
    const rParams$ = this.route.params;
    const change$ = combineLatest([rParams$, this.web3Svc.web3Context$]);
    change$.subscribe(async ([p, ctx]) => {
      if (ctx.foundContract) {
        const stored: Post | null = await this.web3Svc.getPostFromTx(p.txHash);
        if (!stored) return;

        this.postText = stored.text;
        this.postDate = stored.date.toLocaleString();
      }
    });

    setTimeout(() => (this.show = true), 100);
  }
}
