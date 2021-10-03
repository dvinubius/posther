import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostViewerComponent } from './post-viewer/post-viewer.component';
import { HomeComponent } from './home/home.component';
import { PosterComponent } from './poster/poster.component';

const routes: Routes = [
  { path: 'poster', component: PosterComponent },
  { path: ':txHash', component: PostViewerComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
