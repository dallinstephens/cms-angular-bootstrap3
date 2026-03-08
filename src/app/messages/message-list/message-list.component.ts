import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(
    private messageService: MessageService) {}

  // Reference: https://byui.instructure.com/courses/404738/pages/w05-assignment-instructions
  // Modify the ngOnInit() method located in the MessageListComponent class to call the getMessages() 
  // method of the MessageService class.  Assign the array returned from the method to the messages 
  // class variable.
  // Open the message-list.component.ts file and inject the MessageService into the MessageListComponent 
  // class. Implement the ngOnInit() lifecycle method and subscribe to the messageChangedEvent emitter 
  // defined in the MessageService. Assign the copy of the messages array emitted with the 
  // messageChangedEvent to the messages array in the MessageListComponent. A corollary example of how to 
  // do this can be found in the shopping-list.component.ts file in the Recipe Book project.
  ngOnInit() {
    this.messageService.messageListChangedEvent
    .subscribe(
      (messages: Message[]) => {
        this.messages = messages
      }
    );
    this.messageService.getMessages();
  }

  // messages: Message[] = [
  //   new Message('456', 'Subject 1', 'First Message', 'Abraham'),
  //   new Message('789', 'Subject 2', 'Second Message', 'Isaac'),
  //   new Message('8912', 'Subject 3', 'Third Message', 'Jacob')  
  // ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
