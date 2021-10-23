import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ToggleButtonComponent],
  imports: [CommonModule, FormsModule],
  exports: [ToggleButtonComponent],
})
export class SharedModule {}
