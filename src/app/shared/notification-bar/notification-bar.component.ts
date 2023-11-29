import { Component, EventEmitter, Input, Output } from '@angular/core';

//CE COMPONENT EST LA BARRE DE NOTIFICATION

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.css']
})
export class NotificationBarComponent {

  lastLogin!:any;
  affichageDate! : any;
  username!:any;
  closeNotifBar!:boolean;

  // EVENEMENT EMIS PAR LA PAGE D'ACCUEIL LORS DE LA FERMETURE DE LA BARRE 
  @Output() closeNotifBarEvent = new EventEmitter<boolean>();

  //METHODE POUR FERMER LA BARRE DE NOTIFICATION 
  closeTheNotifBar() {
    this.closeNotifBar=false;
    this.closeNotifBarEvent.emit(this.closeNotifBar);
  }

  //RECUPERATION DES DONNES LORS DE L'INITIALISATION DU COMPONENT
  ngOnInit(){
    this.username=localStorage.getItem('username');
    this.lastLogin=localStorage.getItem("lastLogin");
    console.log(this.lastLogin);
    this.lastLogin=new Date(this.lastLogin);
    var month=this.lastLogin.getMonth()+1;
    this.affichageDate=this.lastLogin.getDate().toString()
                        +'/'
                        +month.toString()
                        +'/'
                        +this.lastLogin.getFullYear().toString()
                        +'   '
                        +this.lastLogin.getHours().toString()
                        +':'
                        +this.lastLogin.getMinutes().toString();                   
    this.username=localStorage.getItem('username');
  }
  



}
