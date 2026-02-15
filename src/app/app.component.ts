import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cms';
  // Reference: https://byui.instructure.com/courses/404738/pages/w06-assignment-instructions
  // The switchView() method in the app.component.ts file is no longer needed because Angular routing is being used instead. 
  // Comment out the selectedFeature property and the switchView() method in the AppComponent class.
  // selectedFeature: string = 'documents';

  // switchView(selectedFeature: string) {
  //   this.selectedFeature = selectedFeature;
  // }
}
