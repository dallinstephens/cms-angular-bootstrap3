import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject', { static: false }) subjectInputRef: ElementRef;
  @ViewChild('msgText', { static: false }) msgTextInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender: string;
  // currentSender: string = '1';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subjectValue = this.subjectInputRef.nativeElement.value;
    const msgTextValue = this.msgTextInputRef.nativeElement.value;
    this.currentSender = '101';
    const newMessageObject = new Message('123', subjectValue, msgTextValue, this.currentSender);
    // this.addMessageEvent.emit(newMessageObject);
    this.messageService.addMessage(newMessageObject);
  }

  onClear() {
    // this.subjectInputRef.nativeElement.value = "";
    // this.msgTextInputRef.nativeElement.value = "";

    console.log("Clear button clicked!");
    console.log("Subject Ref:", this.subjectInputRef);
    
    if (this.subjectInputRef) {
      this.subjectInputRef.nativeElement.value = "";
      this.msgTextInputRef.nativeElement.value = "";
    } else {
      console.error("The 'pipe' is broken! Angular can't find the #subject tag.");
    }

  }

}
