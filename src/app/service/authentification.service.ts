import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

//CE SERVICE PERMET D'INTERAGIR AVEC NOTRE SERVEUR NODE 

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private baseURL = 'https://pedago.univ-avignon.fr:3173';

  constructor(private http:HttpClient) { }

  //METHODE POST POUR VOIR SI LA CONNEXION EST VALIDE OU NON == EN ENVOYANT LE USERNAME ET PWD AU SERVEUR QUI VERIFIE AVEC LA BASE
  login(username:any,password:any): Observable<any> {
    const body = { username,password };
    return this.http.post(this.baseURL+'/login',body, { withCredentials: true });
  }
}
