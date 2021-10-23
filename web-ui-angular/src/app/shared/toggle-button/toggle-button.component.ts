import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent {
  @Input() text = 'ON';
  @Input() on = false;
  @Output() changed = new EventEmitter<boolean>();

  constructor() {}

  change(evt: Event) {
    const target = evt.target as HTMLInputElement;
    this.changed.emit(target.checked);
  }
}
