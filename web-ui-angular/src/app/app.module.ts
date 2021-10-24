import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Web3Module } from './web3/web3.module';
import { EssentialsModule } from './essentials/essentials.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EssentialsModule,
    Web3Module,
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
