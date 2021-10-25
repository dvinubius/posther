import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Web3Module } from '../web3';
import { AboutPageComponent } from './about-page/about-page.component';

@NgModule({
  declarations: [HomeComponent, NavbarComponent, AboutPageComponent],
  imports: [CommonModule, RouterModule, Web3Module],
  exports: [NavbarComponent],
})
export class EssentialsModule {}
