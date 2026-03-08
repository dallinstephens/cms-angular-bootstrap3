import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // Create a new EventEmitter of the Message[] data type and assign it to a new class variable named
  // messageChangedEvent at the top of the MessageService class.  
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) { 
    // this.messages = MOCKMESSAGES;
  }

  getMessages(): void {
    // return this.messages.slice();
    this.http
      .get<Message[]>(
        'https://dlscms-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe({ 
        next: (messages: Message[]) => {
          this.messages = messages || [];
          this.maxMessageId = this.getMaxId();
          // Reference for javascript sort array: https://www.w3schools.com/js/js_array_sort.asp
          this.messages.sort((a, b) => { 
            if (a.subject < b.subject) {
              return -1;
            } else if (a.subject > b.subject) {
              return 1;
            } else {
              return 0;
            }
          });
          let messagesListClone = this.messages.slice();
          this.messageListChangedEvent.next(messagesListClone);          
        },
        error: (error: any) => {
          console.log(error);
        }        
      })
  }

  storeMessages() {
        this.http
            .put(
                'https://dlscms-default-rtdb.firebaseio.com/messages.json', 
                JSON.stringify(this.messages),
                { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
            )
            .subscribe(() => {
              let messagesListClone = this.messages.slice();
              this.messageListChangedEvent.next(messagesListClone); 
            })
  }  

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (let message of this.messages) {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;        
      }
    } 
    
    return maxId;
  }


  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // Inside the addMessage method, push the Message passed as an input onto the messages array defined 
  // in the MessageService class.
  // At the end of the addMessage() method, use the messageChangedEvent emitter to emit a copy—for 
  // example, the slice() method.
  addMessage(message: Message) {
    if (message === undefined) {
      return;
    }
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();

    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }
}
