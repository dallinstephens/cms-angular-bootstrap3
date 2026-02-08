import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  selectedDocument: Document;

  constructor(private documentService: DocumentService) {}

  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // Implement the ngOnInit() method and subscribe to the documentSelectedEvent of the DocumentService.
  // Implement an arrow function to receive the document object passed with the emitted event and assign
  // it to the selectedDocument class variable in the DocumentsComponent.
  ngOnInit() {
    this.documentService.documentSelectedEvent
      .subscribe(
        (document: Document) => {
          this.selectedDocument = document;
        }
      );
  }
}
