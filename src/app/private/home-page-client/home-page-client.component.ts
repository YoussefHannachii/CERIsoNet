import { Component } from '@angular/core';
import {MessagesServiceService} from '../../service/messages-service.service';
import { Message } from 'src/app/models/message';
import { async } from '@angular/core/testing';

//CE COMPONENT REPRESENTE LA PAGE D'ACCUEIL DE NOTRE APPLICATION
@Component({
  selector: 'app-home-page-client',
  templateUrl: './home-page-client.component.html',
  styleUrls: ['./home-page-client.component.css']
})
export class HomePageClientComponent {


  constructor(private messagesService : MessagesServiceService) {}

  notificationExists! : boolean;
  notificationType!:string;
  rangeValue = 10;
  listMessages : Message[] = [];


  ngOnInit(){
    this.notificationExists=true;
    this.messagesService.getMessages().subscribe(
      async(response) =>{
        response.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
        console.log(this.listMessages.length);  
      });
      
    }

  recieveNotifCloseEvent(value:boolean){
    this.notificationExists=value;
  }

  onRangeChange(event: any) {
    this.rangeValue = event.target.value;
  }

  bindToModelMessageAndAddToList(response:any){
    this.listMessages.push(new Message(response._id,response.date,response.hour,response.body,
                            response.createdBy,response.image,response.likes,response.hashtags,
                            response.comments));
  }

}
