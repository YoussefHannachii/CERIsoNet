import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {AuthentificationService} from '../../service/authentification.service'
import { Router } from '@angular/router';

//CE COMPONENT REPRESENTE LA PAGE DE CONNEXION

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

constructor(private authentificationService : AuthentificationService,
            private router : Router ) {}

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
      localStorage.setItem('id',response.id);
      localStorage.setItem('lastLogin',response.lastLoginDate);
      localStorage.setItem('isConnected',response.isConnected);
      localStorage.setItem('username',response.username);
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
