import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {AuthentificationService} from '../../service/authentification.service'
import { Router } from '@angular/router';
import { NotificationService,NotificationType  } from 'src/app/service/notification.service';
import { WebsocketService } from 'src/app/service/websocket.service';

//CE COMPONENT REPRESENTE LA PAGE DE CONNEXION

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

constructor(private authentificationService : AuthentificationService,
            private router : Router,
            private notifService : NotificationService,
            private webSocketService : WebsocketService ) {}

isValid! : boolean;  

ngOnInit(){
  this.isValid=true;
  localStorage.clear();
}

// FORMULAIRE DE CONNEXION
connexion = new FormGroup({
  username: new FormControl('',Validators.required),
  password: new FormControl('',Validators.required),
});

// METHODE POUR CONNEXION QUI FAIT APPEL AU SERVICE ET AGIT SUIVANT SA REPONSE
tryLogin(){
  const username = this.connexion.controls.username.value;
  const password = this.connexion.controls.password.value;
  this.authentificationService.login(username,password).subscribe(
    (response) =>{
      console.log(response.id);
      localStorage.setItem('id',response.id);
      localStorage.setItem('lastLogin',response.lastLoginDate);
      localStorage.setItem('isConnected',response.isConnected);
      localStorage.setItem('username',response.username);
      let lastLogin=new Date(response.lastLoginDate);
      var month=lastLogin.getMonth()+1;
      let affichageDate=lastLogin.getDate().toString()
                          +'/'
                          +month.toString()
                          +'/'
                          +lastLogin.getFullYear().toString()
                          +'   '
                          +lastLogin.getHours().toString()
                          +':'
                          +lastLogin.getMinutes().toString();
      let contentNotification = 'Vous revoilà : '+ localStorage.getItem('username') + ', Derniére connexion :' + affichageDate;
      this.notifService.setNotification(true,NotificationType.NewConnection,contentNotification);
      let name = localStorage.getItem('username');
      if(name)
      this.webSocketService.emitLoginReussi({ username: name });
      this.router.navigate(['homePageClient']);
    }, 
    (error)=>{
      this.isValid=false;
    }
  )
}

onSubmit(){
 this.tryLogin();
}

}
