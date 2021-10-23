import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxStatusDialogComponent } from './tx-status-dialog/tx-status-dialog.component';
import { JazziconComponent } from './jazzicon/jazzicon.component';
import { ExplorableHashComponent } from './explorable-hash/explorable-hash.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    TxStatusDialogComponent,
    JazziconComponent,
    ExplorableHashComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatIconModule,
    ClipboardModule,
  ],
  exports: [
    TxStatusDialogComponent,
    JazziconComponent,
    ExplorableHashComponent,
  ],
})
export class Web3Module {}
