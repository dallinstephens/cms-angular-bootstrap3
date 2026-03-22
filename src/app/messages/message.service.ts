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

  sortAndSend() {
    this.messages.sort((a, b) => {
      if (a.sender < b.sender ) return -1;
      if (a.sender < b.sender ) return 1;
      return 0;
    });
    this.messageListChangedEvent.next(this.messages.slice());
  }

  getMessages(): void {
    // return this.messages.slice();
    this.http
      .get<{ message: string, messages: Message[]}>(
        'http://localhost:3000/messages'
        // 'https://dlscms-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe({ 
        next: (responses) => {
        // next: (messages: Message[]) => {
          this.messages = responses.messages || [];
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

  // storeMessages() {
  //       this.http
  //           .put(
  //               'https://dlscms-default-rtdb.firebaseio.com/messages.json', 
  //               JSON.stringify(this.messages),
  //               { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  //           )
  //           .subscribe(() => {
  //             let messagesListClone = this.messages.slice();
  //             this.messageListChangedEvent.next(messagesListClone); 
  //           })
  // }  

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
    if (!message) {
      return;
    }

    // make sure id of new message is empty
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string, newMessage: Message }>(
        'http://localhost:3000/messages', 
        message,
        { headers: headers }
      )
      .subscribe(
        (responseData) => {
          // add new messages to messages
          this.messages.push(responseData.newMessage);
          this.sortAndSend();
        }
      );
  }

  // addMessage(message: Message) {
  //   if (message === undefined) {
  //     return;
  //   }
  //   this.maxMessageId++;
  //   message.id = this.maxMessageId.toString();

  //   this.messages.push(message);
  //   // this.messageChangedEvent.emit(this.messages.slice());
  //   this.storeMessages();
  // }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }
    
    const pos = this.messages.findIndex(d => d.id === originalMessage.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Message to the id of the old message
    newMessage.id = originalMessage.id;
    newMessage._id = originalMessage._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/messages/' + originalMessage.id,
        newMessage,
        { headers: headers }
      )
      .subscribe(
        (response: Response) => {
          this.messages[pos] = newMessage;
          this.sortAndSend();
        }
      );
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex(d => d.id === message.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/messages/' + message.id)
      .subscribe(
        (response: Response) => {
          this.messages.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }
}
