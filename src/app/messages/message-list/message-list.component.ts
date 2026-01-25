import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('456', 'Subject 1', 'First Message', 'Abraham'),
    new Message('789', 'Subject 2', 'Second Message', 'Isaac'),
    new Message('8912', 'Subject 3', 'Third Message', 'Jacob')  
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
