import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Web3Module } from '../web3';

@NgModule({
  declarations: [HomeComponent, NavbarComponent],
  imports: [CommonModule, RouterModule, Web3Module],
  exports: [NavbarComponent],
})
export class EssentialsModule {}
