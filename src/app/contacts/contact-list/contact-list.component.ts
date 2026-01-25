import { Component, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  // Reference: https://byui.instructure.com/courses/404738/pages/w03-assignment-instructions
  // Create a new custom EventEmitter object whose data type is Contact.
  // Assign the new EventEmitter object to a class output variable named selectedContactEvent.
  // The @Output() decorator in front of the variable name tells Angular that this component 
  // will emit an event.
  @Output() selectedContactEvent = new EventEmitter<Contact>();


  contacts: Contact[] = [
    new Contact('1', 'R. Kent Jackson','jacksonk@byui.edu','208-496-3771','../../assets/images/jacksonk.jpg', null),
    new Contact('2', 'Rex Barzee','barzeer@byui.edu','208-496-3768','../../assets/images/barzeer.jpg', null)
  ];

  onSelected(contact: Contact) {
    // Reference: https://byui.instructure.com/courses/404738/pages/w03-assignment-instructions
    // Call the selectedContactEvent emitter's emit() method and pass the contact object passed
    // into the onSelected() method as an argument.
    this.selectedContactEvent.emit(contact);
  }
}
