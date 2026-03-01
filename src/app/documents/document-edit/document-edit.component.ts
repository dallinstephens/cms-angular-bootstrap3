import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit {
  @ViewChild('f') documentForm: NgForm;
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: string;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.
      subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id === undefined || this.id === null) {
            this.editMode = false;
            return;
          }
          this.originalDocument = this.documentService.getDocument(this.id);
          if (this.originalDocument === undefined || this.originalDocument === null) {
            return;
          }
          this.editMode = true;
          // Reference: https://byui.instructure.com/courses/404738/pages/w08-assignment-instructions
          // The original JSON object stored in the originalDocument property is passed to the JSON stringify() method. 
          // It returns a string representation of the JSON object. Then, we call the JSON parse() method and pass it 
          // the string returned from the stringify() method. The parse() method creates and returns a new JSON object 
          // based on the string passed to it.
          this.document = JSON.parse(JSON.stringify(this.originalDocument));
          // Here is another way below to do the above line of code.
          // this.document = { ...this.originalDocument };        
        }
      );
  }

  // Reference: https://byui.instructure.com/courses/404738/pages/w08-assignment-instructions
  // This method is called when the end user selects the Save button and submits the form. 
  // It is responsible for either adding a new document to the document list or updating an 
  // existing document in the document list.
  onSubmit(form: NgForm) {
    // console.log(form);
    const value = form.value; // gets values from form's fields
    let newDocument = new Document(
      '', // id
      value.name,
      value.description,
      value.url,
      null
    );

    if (this.editMode === true) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
}
