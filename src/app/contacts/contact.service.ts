import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) { 
    // this.contacts = MOCKCONTACTS;
  }

  sortAndSend() {
    this.contacts.sort((a, b) => {
      if (a.name < b.name ) return -1;
      if (a.name < b.name ) return 1;
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }  

  getContacts(): void {
    // return this.contacts.slice();
    this.http
      .get<{ message: string, contacts: Contact[] }>(
        'http://localhost:3000/contacts'
        // 'https://dlscms-default-rtdb.firebaseio.com/contacts.json'
      )
      .subscribe({ 
        next: (responses) => {
        // next: (contacts: Contact[]) => {
          this.contacts = responses.contacts || [];
          // this.contacts = contacts || [];
          this.maxContactId = this.getMaxId();
          // Reference for javascript sort array: https://www.w3schools.com/js/js_array_sort.asp
          this.contacts.sort((a, b) => { 
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          });
          let contactsListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactsListClone);          
        },
        error: (error: any) => {
          console.log(error);
        }        
      })
  }

  // storeContacts() {
  //       this.http
  //           .put(
  //               'https://dlscms-default-rtdb.firebaseio.com/contacts.json', 
  //               JSON.stringify(this.contacts),
  //               { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //           )
  //           .subscribe(() => {
  //             let contactsListClone = this.contacts.slice();
  //             this.contactListChangedEvent.next(contactsListClone); 
  //           })
  // }
  

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
    // Shortcut way to do it:
    // return this.contacts.find((contact) => contact.id === id) || null;

    // FOR each contact in the contact list
    // IF contact.id equals the id THEN
    // RETURN contact
    // ENDIF
    // ENDFOR
    // RETURN null
  }

  getMaxId(): number {
    let maxId = 0;

    for (let contact of this.contacts) {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;        
      }
    } 
    
    return maxId;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of new contact is empty
    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string, contact: Contact }>(
        'http://localhost:3000/contacts', 
        contact,
        { headers: headers }
      )
      .subscribe(
        (responseData) => {
          // add new contacts to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }  

  // addContact(newContact: Contact) {
  //   if (newContact === undefined || newContact === null) {
  //     return;
  //   }

  //   this.maxContactId++;
  //   newContact.id = this.maxContactId.toString();
  //   this.contacts.push(newContact);
  //   // let contactsListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactsListClone);
  //   this.storeContacts();
  // }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    
    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old contact
    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/contacts/' + originalContact.id,
        newContact,
        { headers: headers }
      )
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }

  // updateContact(originalContact: Contact, newContact: Contact) {
  //   if (originalContact === undefined || newContact === undefined || originalContact === null || newContact === null) {
  //     return;
  //   }
    
  //   let pos = this.contacts.indexOf(originalContact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   newContact.id = originalContact.id;
  //   this.contacts[pos] = newContact;
  //   // let contactsListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactsListClone);
  //   this.storeContacts();
  // }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }  

  // deleteContact(contact: Contact) {
  //   if (contact === undefined || contact === null) {
  //     return;
  //   }

  //   let pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   // let contactsListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactsListClone);
  //   this.storeContacts();
  // }

  // deleteContact(contact: Contact) {
  //   if (!contact) {
  //     return;
  //   }
  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   this.contactChangedEvent.emit(this.contacts.slice());
  // }

}
