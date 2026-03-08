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

  getContacts(): void {
    // return this.contacts.slice();
    this.http
      .get<Contact[]>(
        'https://dlscms-default-rtdb.firebaseio.com/contacts.json'
      )
      .subscribe({ 
        next: (contacts: Contact[]) => {
          this.contacts = contacts || [];
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

  storeContacts() {
        this.http
            .put(
                'https://dlscms-default-rtdb.firebaseio.com/contacts.json', 
                JSON.stringify(this.contacts),
                { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
            )
            .subscribe(() => {
              let contactsListClone = this.contacts.slice();
              this.contactListChangedEvent.next(contactsListClone); 
            })
  }
  

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

  addContact(newContact: Contact) {
    if (newContact === undefined || newContact === null) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact === undefined || newContact === undefined || originalContact === null || newContact === null) {
      return;
    }
    
    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (contact === undefined || contact === null) {
      return;
    }

    let pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

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
