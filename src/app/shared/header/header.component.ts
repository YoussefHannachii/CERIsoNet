import { Component } from '@angular/core';
import { Router } from '@angular/router';

//CE COMPONENT EST LE HEADER DE MON ECRAN D'ACCUEIL

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router : Router ) {}

  //METHODE DE DECONNEXION DE LA PAGE D'ACCEUIL
  deconnexion(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
