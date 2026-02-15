import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService) {}

  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // The value of the sender property for each Message defined in the MOCKMESSAGE.ts file now contains
  // a reference to the id property of the Contact that sent the message instead of the name of the
  // sender of the message. You will need to modify the MessageItemComponent to first get the Contact
  // object with the specified id, and then get the name property from the Contact to be displayed as
  // the sender of the message.
  // Implement the ngOnInit() lifecycle method. Inside of the method, call the getContact() method 
  // and pass it the value of the sender property of the current message as shown below. Then, get 
  // the name of the contact found and assign it to the class variable messageSender.
  ngOnInit() {
    // this.message.sender is an id for the contact - see MOCKMESSAGES.ts and MOCKCONTACTS.ts
    const contact: Contact = this.contactService.getContact(this.message.sender);
    if (contact) {
      this.messageSender = contact.name;
    } else {
      this.messageSender = 'Dallin Stephens';
    } 
  }

}
