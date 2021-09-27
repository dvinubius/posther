import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { HomeComponent } from './home/home.component';
import { PosterComponent } from './poster/poster.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ViewerComponent, HomeComponent, PosterComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
