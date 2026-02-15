import { Component, OnInit } from '@angular/core';
// import { Component, Input } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  // @Input() document: Document;
  id: string;
  nativeWindow: any;

  constructor(private documentService: DocumentService,
              private windowRefService: WindRefService,
              private route: ActivatedRoute,
              private router: Router
  ) {}

  // Reference: https://byui.instructure.com/courses/404738/pages/w06-assignment-instructions
  // Implement the ngOnInit() lifecycle method and subscribe to the parameters of the active route. 
  // Pass an arrow (=>) function to the subscribe() method as an input. This function is automatically 
  // called each time the current route is modified. The arrow function will receive the route’s input 
  // parameters (params) as an input. Inside of the function, get the value of the id route parameter 
  // and then call the getDocument(id: string) method of the DocumentService to the get the Document 
  // whose id property matches the value of the id route parameter. Assign the returned Document to the 
  // document property.

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.document = this.documentService.getDocument(this.id);
        }
      );
    this.nativeWindow = this.windowRefService.getNativeWindow();  
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }
}
