import { Component } from '@angular/core';
import {MessagesServiceService} from '../../service/messages-service.service';
import { Message } from 'src/app/models/message';
import { async } from '@angular/core/testing';
import { UserServiceService } from 'src/app/service/user-service.service';

//CE COMPONENT REPRESENTE LA PAGE D'ACCUEIL DE NOTRE APPLICATION
@Component({
  selector: 'app-home-page-client',
  templateUrl: './home-page-client.component.html',
  styleUrls: ['./home-page-client.component.css']
})
export class HomePageClientComponent {


  constructor(private messagesService : MessagesServiceService,
              private userService : UserServiceService) {}

  notificationExists! : boolean;
  notificationType!:string;
  messageParPage = 10;
  page = 1;
  listMessages : Message[] = [];
  totalMassages!: number ;
  methodeDeTri!: string;

  log(){
    console.log("clicked");
  }

  ngOnInit(){
    this.userService.getUserDataFromMessageId(115).subscribe(
      async (response)=> {
        console.log("user Data : ");
        console.log(response);
      })
    this.notificationExists=true;
    let cpt =0;
    this.messagesService.getMessages().subscribe(
      async(response) =>{
        
        response.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
        this.totalMassages=this.listMessages.length;  
      });
      
    }

  recieveNotifCloseEvent(value:boolean){
    this.notificationExists=value;
  }

  onRangeChange(event: any) {
    this.messageParPage = event.target.value;
  }

  bindToModelMessageAndAddToList(response:any){
    this.listMessages.push(new Message(response._id,response.date,response.hour,response.body,
                            response.createdBy,response.images,response.likes,response.hashtags,
                            response.comments));
  }

}
