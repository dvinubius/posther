import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostViewerComponent } from './post-viewer/post-viewer.component';
import { HomeComponent } from './home/home.component';
import { PosterComponent } from './poster/poster.component';
import { FormsModule } from '@angular/forms';
import { PostCardComponent } from './post-card/post-card.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    PostViewerComponent,
    HomeComponent,
    PosterComponent,
    PostCardComponent,
    NavbarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
