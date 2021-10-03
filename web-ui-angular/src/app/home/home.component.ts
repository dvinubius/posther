import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Web3Service } from '../web3.service';
import { PostTransaction } from '../models/post-transaction.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  targetNetwork = environment.contractNetwork;

  postTxs!: PostTransaction[];

  constructor(public web3Svc: Web3Service) {}

  ngOnInit() {
    this._getPosts();
    this.web3Svc.web3Context$.subscribe((_) => this._getPosts());
  }

  private async _getPosts() {
    try {
      this.postTxs = await this.web3Svc.getPosts();
    } catch (err) {
      console.error(err);
    }
  }
}
