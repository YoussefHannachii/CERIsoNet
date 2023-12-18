import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService,NotificationType } from 'src/app/service/notification.service';
import { WebsocketService } from 'src/app/service/websocket.service';

//CE COMPONENT EST LA BARRE DE NOTIFICATION

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.css']
})
export class NotificationBarComponent {

  constructor(
    private notifService : NotificationService ,
    private webSocketService : WebsocketService 
    ) {}

  notif!:any;
  notifContent!:string;
  notifExists!:boolean;
  notifType!:any;

  // EVENEMENT EMIS PAR LA PAGE D'ACCUEIL LORS DE LA FERMETURE DE LA BARRE 
  

  //METHODE POUR FERMER LA BARRE DE NOTIFICATION 
  closeTheNotifBar() {
    this.notifService.setNotification(false,NotificationType.Default,'');
  }

  //RECUPERATION DES DONNES LORS DE L'INITIALISATION DU COMPONENT
  ngOnInit(){
    this.notifService.getNotification().subscribe((notification)=>{
      this.notif=notification;
      this.notifContent=notification.content;
      this.notifExists=notification.hasNotification;
      this.notifType=notification.type;
      console.log(this.notifType=='newConnectionOther');
    });



    // this.username=localStorage.getItem('username');
    // this.lastLogin=localStorage.getItem("lastLogin");
    // console.log(this.lastLogin);
    // this.lastLogin=new Date(this.lastLogin);
    // var month=this.lastLogin.getMonth()+1;
    // this.affichageDate=this.lastLogin.getDate().toString()
    //                     +'/'
    //                     +month.toString()
    //                     +'/'
    //                     +this.lastLogin.getFullYear().toString()
    //                     +'   '
    //                     +this.lastLogin.getHours().toString()
    //                     +':'
    //                     +this.lastLogin.getMinutes().toString();                   
    // this.username=localStorage.getItem('username');
  }

}
