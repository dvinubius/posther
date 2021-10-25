import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {
  get contractLink() {
    return `${environment.etherscanUrl}/address/${environment.contractAddress}`;
  }

  githubLink = 'https://github.com/dvinubius/posther';

  constructor() {}

  ngOnInit(): void {}
}
