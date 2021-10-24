import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { PublishPageComponent } from './publish-page/publish-page.component';
import { RetrievePosthPageComponent } from './read/retrieve-posth-page/retrieve-posth-page.component';
import { ReadPosthPageComponent } from './read/read-posth-page/read-posth-page.component';
import { ExplorerPageComponent } from './explore/explorer-page/explorer-page.component';
import { ReadablePosthComponent } from './read/readable-posth/readable-posth.component';
import { RetrievedPosthComponent } from './read/retrieved-posth/retrieved-posth.component';
import { PosthCardComponent } from './explore/posth-card/posth-card.component';
import { Web3Module } from '../web3';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    PublishPageComponent,
    RetrievePosthPageComponent,
    ReadPosthPageComponent,
    ExplorerPageComponent,
    ReadablePosthComponent,
    RetrievedPosthComponent,
    PosthCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    Web3Module,
    MatProgressSpinnerModule,
  ],
})
export class PosthsModule {}
