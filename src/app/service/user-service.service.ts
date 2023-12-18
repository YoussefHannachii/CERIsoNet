import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private selectedUser = new BehaviorSubject<any>(null);
  private listOfUsers: User[] = [];
  selectedUser$ = this.selectedUser.asObservable();

  private baseUrl = 'https://pedago.univ-avignon.fr:3173/api/user'

  constructor(private http:HttpClient) { }

  getUserDataFromMessageId(id:number): Observable<any> {
    return this.http.get(this.baseUrl+'/one/'+id, { withCredentials: true });
  }

  getAllUsersData(): Observable<any>{
    return this.http.get(this.baseUrl+'/list',{ withCredentials : true});
  }

  deconnexionUser(username:any) : Observable<any> {
    return this.http.put(this.baseUrl+'/deconnexion', { username:username }, { withCredentials : true});
  }

  setListOfUsers(list:User[]){
    this.listOfUsers = list;
  }

  getListOfUsers(){
    return this.listOfUsers;
  }

  setSelectedUser(user:any){
    this.selectedUser=user;
  }
  getSelectedUser(){
    return this.selectedUser;
  }

}
