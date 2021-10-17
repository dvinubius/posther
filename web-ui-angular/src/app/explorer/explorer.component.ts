import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { PostTransaction } from '../models/post-transaction.model';
import { Web3Service, Web3Context } from '../web3.service';
import { PostsService } from '../posts.service';
import { filter } from 'rxjs/operators';
import { TransientUsageService } from '../transient-usage.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  targetNetwork = environment.contractNetwork;

  postTxs: PostTransaction[] | undefined;

  onlyMine = false;

  howMany = 7;

  constructor(
    public web3Svc: Web3Service,
    public postsSvc: PostsService,
    private usageSvc: TransientUsageService,
    private route: ActivatedRoute
  ) {
    this.onlyMine = this.usageSvc.onlyMine;
  }

  ngOnInit() {
    const rParams$ = this.route.params;
    const relevantContext$ = this.web3Svc.web3Context$.pipe(
      filter((ctx: Web3Context) => ctx.foundContract)
    );
    const change$ = combineLatest([rParams$, relevantContext$]);
    change$.subscribe(async ([p, ctx]) => {
      if (p.howMany) this.howMany = p.howMany;
      this._getPosts();
    });

    this.web3Svc.web3Context$
      .pipe(filter((ctx: Web3Context) => !ctx.signer))
      .subscribe(() => (this.onlyMine = false));
  }

  private async _getPosts() {
    this.postTxs = await this.postsSvc.getMostRecentPosts(
      this.howMany,
      this.onlyMine
    );
  }
  async toggleMine() {
    this.onlyMine = !this.onlyMine;
    this.usageSvc.onlyMine = this.onlyMine;
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
