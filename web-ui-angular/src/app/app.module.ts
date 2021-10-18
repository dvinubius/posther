import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RetrievePostPageComponent } from './retrieve-post-page/retrieve-post-page.component';
import { HomeComponent } from './home/home.component';
import { PosterComponent } from './poster/poster.component';
import { FormsModule } from '@angular/forms';
import { PostCardComponent } from './post-card/post-card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { JazziconComponent } from './jazzicon/jazzicon.component';
import { PostComponent } from './post/post.component';
import { ReadPostPageComponent } from './read-post-page/read-post-page.component';
import { ExplorableHashComponent } from './explorable-hash/explorable-hash.component';
import { RetrievedPostDisplayComponent } from './retrieved-post-display/retrieved-post-display.component';

@NgModule({
  declarations: [
    AppComponent,
    RetrievePostPageComponent,
    HomeComponent,
    PosterComponent,
    PostCardComponent,
    NavbarComponent,
    ToggleButtonComponent,
    ExplorerComponent,
    JazziconComponent,
    PostComponent,
    ReadPostPageComponent,
    ExplorableHashComponent,
    RetrievedPostDisplayComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ClipboardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
