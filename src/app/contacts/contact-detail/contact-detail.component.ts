import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent {
  // Reference: https://byui.instructure.com/courses/404738/pages/w03-assignment-instructions
  // The value of the selectedContact variable now needs to be passed down to the 
  // ContactDetailComponent as an input.
  @Input() contact: Contact;


  ngOnInit() {
    // this.contact = new Contact(
    //   '1',
    //   'R. Kent Jackson',
    //   'jacksonk@byui.edu',
    //   '208-496-3771',
    //   '../../assets/images/jacksonk.jpg',
    //   null
    // );
  }
}
