import { Component, OnInit } from '@angular/core';
// import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  // Reference: https://byui.instructure.com/courses/404738/pages/w03-assignment-instructions
  // The value of the selectedContact variable now needs to be passed down to the 
  // ContactDetailComponent as an input.
  contact: Contact;
  // @Input() contact: Contact;
  id: string;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.contact = this.contactService.getContact(this.id);
        }
      );

    // this.contact = new Contact(
    //   '1',
    //   'R. Kent Jackson',
    //   'jacksonk@byui.edu',
    //   '208-496-3771',
    //   '../../assets/images/jacksonk.jpg',
    //   null
    // );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
}
