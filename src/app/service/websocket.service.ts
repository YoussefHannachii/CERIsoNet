import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket = io('https://pedago.univ-avignon.fr:3173'); // Remplacez par l'URL de votre serveur

    constructor() {
      this.setupSocketConnection();
    }

    private setupSocketConnection(): void {
      this.socket.on('connect', () => {
          console.log('Connecté au serveur WebSocket');
      });
  }

  public getSocketId(): string {
      return this.socket.id;
  }

  public listen(event: string): Observable<any> {
      return new Observable<any>((observer) => {
          this.socket.on(event, (data) => {
              observer.next(data);
          });
      });
  }

  public emit(event: string, data: any): void {
      this.socket.emit(event, data);
  }

  public emitLoginReussi(data: { username: string }): void {
    this.emit('loginReussi', data);
  }

  public emitDeconnexionReussi(data: { username: string }): void {
    this.emit('deconnexionReussi', data);
  }

}