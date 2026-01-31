import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    // id, name, description, url, children
    new Document('1', 'CIT 111 - Introduction to Databases', 'MySQL, MySQL Workbench', '../../assets/images/documentCIT111.jpg', null),
    new Document('2', 'CSE 111 - Programming with Functions', 'Python3, Visual Studio Code', '../../assets/images/documentCSE111.jpg', null),
    new Document('3', 'CSE 210 - Programming with Classes', 'C#, Visual Studio Code, Classes', '../../assets/images/documentCSE210.jpg', null),
    new Document('4', 'CSE 212 - Programming with Data Structures', 'C#, Visual Studio Code, Data Structures', '../../assets/images/documentCSE212.jpg', null),
    new Document('5', 'WDD 130 - Web Fundamentals', 'HTML, CSS, Wireframes', '../../assets/images/documentWDD130.jpg', null)
  ];

  onSelectedDocument(document: Document) {
    // Reference: https://byui.instructure.com/courses/404738/pages/w04-assignment-instructions
    // emit the selectedDocumentEvent and pass it the document object passed into the method
    this.selectedDocumentEvent.emit(document);
  }
}

// Reference: https://gemini.google.com/app
// Explanation:
// The Trigger: A user clicks a document in your HTML template.
// The Method: That click calls onSelectedDocument(document).
// The Line: Your line this.selectedDocumentEvent.emit(document) sends that document out of this component.
// The Parent: Your parent component (likely DocumentsComponent) will be "listening" in its HTML like this: 
// <cms-document-list (selectedDocumentEvent)="doSomething($event)"></cms-document-list>
