import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  storageEntryText = '';
  date = '';
  home = false;

  constructor(
    private route: ActivatedRoute,
    private web3Service: Web3Service
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (p) => {
      const stored = await this.web3Service.getPostForCode(p.code);
      debugger;
      const entry = JSON.parse(stored);
      this.storageEntryText = entry.text ?? '';
    });
  }
}
