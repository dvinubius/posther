import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxStatusDialogComponent } from './tx-status-dialog/tx-status-dialog.component';
import { JazziconComponent } from './jazzicon/jazzicon.component';
import { ExplorableHashComponent } from './explorable-hash/explorable-hash.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared';
import { ClipboardModule } from 'ngx-clipboard';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TxStatusDialogComponent,
    JazziconComponent,
    ExplorableHashComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule,
    SharedModule,
    ClipboardModule,
  ],
  exports: [
    TxStatusDialogComponent,
    JazziconComponent,
    ExplorableHashComponent,
  ],
})
export class Web3Module {}
