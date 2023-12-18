import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  private baseUrl ='https://pedago.univ-avignon.fr:3173/api/messages';
  private selectedMessage = new BehaviorSubject<any>(null);
  selectedMessage$ = this.selectedMessage.asObservable();

  constructor(private http:HttpClient) { }

  getMessagesPaginated(page:number,limit:number): Observable<any> {
    return this.http.get(this.baseUrl+'/'+page+'/'+limit, { withCredentials: true });
  }

  getMessages() : Observable<any> {
    return this.http.get(this.baseUrl+'/list',{ withCredentials: true });
  }

  getMessagesSortedByLikesUp() : Observable<any> {
    return this.http.get(this.baseUrl+'/likesOrderUp', { withCredentials: true });
  }

  getMessagesSortedByLikesDown() : Observable<any> {
    return this.http.get(this.baseUrl+'/likesOrderDown', { withCredentials: true });
  }

  getMessagesSortedByDateUp() : Observable<any> {
    return this.http.get(this.baseUrl+'/dateOrderUp', { withCredentials: true });
  }

  getMessagesSortedByDateDown() : Observable<any> {
    return this.http.get(this.baseUrl+'/dateOrderDown', { withCredentials: true });
  }

  getMessageByHashtag(hashtag:any) : Observable<any> {
    return this.http.get(this.baseUrl+'/tag/'+hashtag,{ withCredentials: true });
  }

  getMessagesOfSomeone(id:any) : Observable<any> {
    return this.http.get(this.baseUrl+'/user/'+id,{ withCredentials: true })
  }

  likeMessage(id:any) : Observable<any> {
    return this.http.put(this.baseUrl+'/like', {messageId : id} , { withCredentials: true } );
  }

  dislikeMessage(id:any) : Observable<any> {
    return this.http.put(this.baseUrl+'/dislike',{ messageId : id },  { withCredentials: true });
  }

  shareMessage(messageId:any,userId:any,content:any) : Observable<any> {
    return this.http.post(this.baseUrl+'/share',{ messageId : messageId ,userId : userId , content: content },  { withCredentials: true });
  }

  commentMessage(messageId:any,userId:any,content:any) : Observable<any> {
    return this.http.put(this.baseUrl+'/comment',{ messageId : messageId ,userId : userId , content: content },  { withCredentials: true });
  }

  setSelectedMessage(message:any){
    this.selectedMessage=message;
  }
  getSelectedMessage(){
    return this.selectedMessage;
  }

}
