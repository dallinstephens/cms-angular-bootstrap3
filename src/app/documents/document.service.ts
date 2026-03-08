import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    // this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): void {
    this.http
      .get<Document[]>(
        'https://dlscms-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe({ 
        next: (documents: Document[]) => {
          this.documents = documents || [];
          this.maxDocumentId = this.getMaxId();
          // Reference for javascript sort array: https://www.w3schools.com/js/js_array_sort.asp
          this.documents.sort((a, b) => { 
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          });
          let documentsListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentsListClone);          
        },
        error: (error: any) => {
          console.log(error);
        }        
      })
    // return this.documents.slice();
  };

  storeDocuments() {
        this.http
            .put(
                'https://dlscms-default-rtdb.firebaseio.com/documents.json', 
                JSON.stringify(this.documents),
                { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
            )
            .subscribe(() => {
              let documentsListClone = this.documents.slice();
              this.documentListChangedEvent.next(documentsListClone); 
            })
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id) || null;
  }

  // deleteDocument(document: Document) {
  //   if (!document) {
  //     return;
  //   }
  //   const pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.documents.splice(pos, 1);
  //   this.documentChangedEvent.emit(this.documents.slice());
  // }

  getMaxId(): number {
    let maxId = 0;

    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;        
      }
    } 
    
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || newDocument === null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument === undefined || newDocument === undefined || originalDocument === null || newDocument === null) {
      return;
    }
    
    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (document === undefined || document === null) {
      return;
    }

    let pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }
}
