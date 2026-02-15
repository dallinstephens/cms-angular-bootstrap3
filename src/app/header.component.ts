import { Component } from '@angular/core';
// import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Reference: https://byui.instructure.com/courses/404738/pages/w06-assignment-instructions
  // The EventEmitter and the onSelected method are no longer needed in the header.component.ts file
  // because Angular routing is being used instead. 
  // @Output() selectedFeatureEvent = new EventEmitter<string>();

  // onSelected(selectedEvent: string) {
  //   this.selectedFeatureEvent.emit(selectedEvent);
  // }
}
