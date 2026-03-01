import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id === undefined || this.id === null) {
            this.editMode = false;
            return;
          }
          this.originalContact = this.contactService.getContact(this.id);
          if (this.originalContact === undefined || this.originalContact === null) {
            return;
          }
          this.editMode = true;
          this.contact = JSON.parse(JSON.stringify(this.originalContact));
          if (this.contact.group) {
            this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
          }
        }
      );
  }


  onSubmit(form: NgForm) {
    const value = form.value; // gets values from form's fields
    let newContact = new Contact(
      '', // id
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      null
    );

    if (this.editMode === true) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }
}
