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
import { ClipboardModule } from 'ngx-clipboard';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';

@NgModule({
  declarations: [
    AppComponent,
    PostViewerComponent,
    HomeComponent,
    PosterComponent,
    PostCardComponent,
    NavbarComponent,
    ToggleButtonComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ClipboardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
