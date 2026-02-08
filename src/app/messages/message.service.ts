import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // Create a new EventEmitter of the Message[] data type and assign it to a new class variable named
  // messageChangedEvent at the top of the MessageService class.  
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() { 
    this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id) || null;
  }

  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // Inside the addMessage method, push the Message passed as an input onto the messages array defined 
  // in the MessageService class.
  // At the end of the addMessage() method, use the messageChangedEvent emitter to emit a copy—for 
  // example, the slice() method.
  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
