import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { PostsService } from '../posts.service';
import { Web3Service, Web3Error } from '../web3.service';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.scss'],
})
export class PosterComponent implements OnInit {
  maxPostLength = environment.maxPostLength;
  inputText = '';
  error = '';
  constructor(private postSvc: PostsService, private web3Svc: Web3Service) {}

  ngOnInit(): void {}

  async post() {
    const hasConnectedAccount = await this.web3Svc.userConnectAccount();
    if (!hasConnectedAccount) {
      this.error = Web3Error.NO_ACCOUNT;
      return;
    }
    this.postSvc.post(this.inputText);
  }
}
