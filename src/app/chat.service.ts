import { Injectable } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';

import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


export class Message {
  constructor(public content: string, public sentBy: string) {}
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  token = environment.renualtBot;
  client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  this.update(botMessage);
               });
  }

  update(msg: Message) {
    this.conversation.next([msg]);
  }
}
