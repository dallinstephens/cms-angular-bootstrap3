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

  sortAndSend() {
    this.documents.sort((a, b) => {
      if (a.name < b.name ) return -1;
      if (a.name < b.name ) return 1;
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments(): void {
    this.http
      .get<{ message: string, documents: Document[] }>(
        'http://localhost:3000/documents'
        // 'https://dlscms-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe({ 
        next: (response) => {
        // next: (documents: Document[]) => {
          this.documents = response.documents || [];
          // this.documents = documents || [];
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

  // storeDocuments() {
  //       this.http
  //           .put(
  //               'https://dlscms-default-rtdb.firebaseio.com/documents.json', 
  //               JSON.stringify(this.documents),
  //               { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //           )
  //           .subscribe(() => {
  //             let documentsListClone = this.documents.slice();
  //             this.documentListChangedEvent.next(documentsListClone); 
  //           })
  // }

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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of new document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string, document: Document }>(
        'http://localhost:3000/documents', 
        document,
        { headers: headers }
      )
      .subscribe(
        (responseData) => {
          // add new documents to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }
  // addDocument(newDocument: Document) {
  //   if (newDocument === undefined || newDocument === null) {
  //     return;
  //   }

  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (originalDocument === undefined || newDocument === undefined || originalDocument === null || newDocument === null) {
  //     return;
  //   }
    
  //   let pos = this.documents.indexOf(originalDocument);
  //   if (pos < 0) {
  //     return;
  //   }
  //   newDocument.id = originalDocument.id;
  //   this.documents[pos] = newDocument;
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  // deleteDocument(document: Document) {
  //   if (document === undefined || document === null) {
  //     return;
  //   }

  //   let pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.documents.splice(pos, 1);
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }
}
