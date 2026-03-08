import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {
  // Reference: https://byui.instructure.com/courses/404738/pages/w09-assignment-instructions

  transform(contacts: Contact[], term: string): any {
    let filteredContacts: Contact[] = [];

    if (term && term.length > 0) {
      filteredContacts = contacts.filter(
        (contact: Contact) => contact.name.toLowerCase().includes(term.toLowerCase())   
      );
    }

    if (filteredContacts.length < 1) {
      return contacts;
    }

    return filteredContacts;
  }

  // transform(contacts: Contact[], term: string): any {
  //   let filteredArray: Contact[] = [];

  //   for (let i=0; i < contacts.length; i++) {
  //     let contact = contacts[i];
  //     if (contact.name.toLowerCase().includes(term)) {
  //       filteredArray.push(contact);
  //     }
  //   }

  //   if (filteredArray.length < 1) {
  //     return contacts;
  //   }

  //   return filteredArray;
  // }
}
