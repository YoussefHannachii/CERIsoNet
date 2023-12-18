import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/service/user-service.service';
import { WebsocketService } from 'src/app/service/websocket.service';

//CE COMPONENT EST LE HEADER DE MON ECRAN D'ACCUEIL

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router : Router,
              private userService : UserServiceService,
              private webSocketService : WebsocketService ) {}

  //METHODE DE DECONNEXION DE LA PAGE D'ACCEUIL
  deconnexion(){
    this.userService.deconnexionUser(localStorage.getItem('username')).subscribe((response)=>{
      console.log(response);
    });
    let name = localStorage.getItem('username');
    if(name)
    this.webSocketService.emitDeconnexionReussi({ username: name})
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
