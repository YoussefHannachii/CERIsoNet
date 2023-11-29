import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  private baseUrl ='https://pedago.univ-avignon.fr:3173/api/messages';

  constructor(private http:HttpClient) { }

  getMessagesPaginated(page:number,limit:number): Observable<any> {
    return this.http.get(this.baseUrl+'/'+page+'/'+limit, { withCredentials: true });
  }

  getMessages() : Observable<any> {
    return this.http.get(this.baseUrl+'/list',{ withCredentials: true });
  }

}
