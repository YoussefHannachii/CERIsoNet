import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export enum NotificationType {
  Default = 'default',
  NewConnection = 'newConnection',
  NewConnectionOther = 'newConnectionOther',
  DeconnexionOther = 'deconnexionOther',
  LikeUtilisateur = 'likeUtilisateur',
  LikeAutreUtilisateur = 'likeAutreUtilisateur',
  DislikeUtilisateur = 'dislikeUtilisateur',
  CommentUtilisateur = 'commentUtilisateur',
  CommentAutreUtilisateur = 'commentAutreUtilisateur',
  PartageUtilisateur = 'partageUtilisateur',
  PartageAutreUtilisateur = 'partageAutreUtilisateur',
  // Ajoutez d'autres types de notification au besoin
}

export interface NotificationData {
  hasNotification: boolean;
  type: NotificationType | null;
  content: string; // Contenu spécifique à afficher dans la notification
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notification = new BehaviorSubject<NotificationData>({
    hasNotification: false,
    type: null,
    content: '',
  });
  notification$ = this._notification.asObservable();

  

  constructor() { }
  
  setNotification(hasNotification: boolean, type: NotificationType , content: string = ''): void {
    this._notification.next({ hasNotification, type, content });
  }

  getNotification(){
    return this.notification$;
}
}
