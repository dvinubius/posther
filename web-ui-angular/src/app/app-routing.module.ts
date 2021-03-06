import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './essentials';
import { AboutPageComponent } from './essentials/about-page/about-page.component';
import {
  ExplorerPageComponent,
  PublishPageComponent,
  ReadPosthPageComponent,
  RetrievePosthPageComponent,
} from './posths';

const routes: Routes = [
  { path: 'explorer/:howMany', component: ExplorerPageComponent },
  { path: 'explorer', component: ExplorerPageComponent },
  { path: 'publish', component: PublishPageComponent },
  { path: 'read/:txHash', component: ReadPosthPageComponent },
  { path: 'retrieve', component: RetrievePosthPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutPageComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
