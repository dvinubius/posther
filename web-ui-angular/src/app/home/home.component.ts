import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Web3Service, Web3Context } from '../web3.service';
import { PostTransaction } from '../models/post-transaction.model';
import { environment } from '../../environments/environment';
import { filter } from 'rxjs/operators';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  targetNetwork = environment.contractNetwork;

  postTxs: PostTransaction[] | undefined;

  onlyMine = false;

  constructor(public web3Svc: Web3Service, public postsSvc: PostsService) {}

  ngOnInit() {
    this.web3Svc.web3Context$
      .pipe(filter((ctx: Web3Context) => ctx.foundContract))
      .subscribe(() => this._getPosts());

    this.web3Svc.web3Context$
      .pipe(filter((ctx: Web3Context) => !ctx.signer))
      .subscribe(() => (this.onlyMine = false));
  }

  private async _getPosts() {
    this.postTxs = await this.postsSvc.getPosts(this.onlyMine);
  }

  async toggleMine() {
    this.onlyMine = !this.onlyMine;
    if (this.onlyMine) {
      const hasConnectedAccount = await this.web3Svc.userConnectAccount();
      if (!hasConnectedAccount) {
        this.onlyMine = false;
        return;
      }
    }
    this._getPosts();
  }
}
