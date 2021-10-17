import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostViewerComponent } from './post-viewer/post-viewer.component';
import { HomeComponent } from './home/home.component';
import { PosterComponent } from './poster/poster.component';
import { ExplorerComponent } from './explorer/explorer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'explorer/:howMany', component: ExplorerComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'post', component: PosterComponent },
  { path: 'read/:txHash', component: PostViewerComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
