import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetrievePostPageComponent } from './retrieve-post-page/retrieve-post-page.component';
import { HomeComponent } from './home/home.component';
import { PosterComponent } from './poster/poster.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { ReadPostPageComponent } from './read-post-page/read-post-page.component';

const routes: Routes = [
  { path: 'explorer/:howMany', component: ExplorerComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'post', component: PosterComponent },
  { path: 'read/:txHash', component: ReadPostPageComponent },
  { path: 'retrieve', component: RetrievePostPageComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
