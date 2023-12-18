import { ChangeDetectorRef, Component } from '@angular/core';
import {MessagesServiceService} from '../../service/messages-service.service';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { async } from '@angular/core/testing';
import { UserServiceService } from 'src/app/service/user-service.service';
import { ResolveStart, Router } from '@angular/router';
import { NotificationService,NotificationType } from 'src/app/service/notification.service';
import { LocalizedString } from '@angular/compiler';
import { WebsocketService } from 'src/app/service/websocket.service';

//CE COMPONENT REPRESENTE LA PAGE D'ACCUEIL DE NOTRE APPLICATION
@Component({
  selector: 'app-home-page-client',
  templateUrl: './home-page-client.component.html',
  styleUrls: ['./home-page-client.component.css']
})
export class HomePageClientComponent {


  constructor(private messagesService : MessagesServiceService,
              private userService : UserServiceService,
              private router : Router,
              private cdr: ChangeDetectorRef,
              private notifService : NotificationService,
              private webSocketService : WebsocketService,
              ) {}
  
  notificationExists! : boolean;
  notificationType!:any;
  messageParPage = 10;
  page = 1;
  listMessages : Message[] = [];
  listUsers : User[] = [];
  totalMassages!: number ;
  methodeDeTri!: string;
  methodeDeFiltre='nomUtilisateur';
  placeHolderText='Rechercher par nom d\'utilisateur ';
  isHovered = false;
  userInput!:string;
  showDropdown: boolean = false;
  selectedOption!: User ;
  dropdownOptions: User[] = [];
  isSharePopUp=false;
  shareContent!:string;

  likedMessages : Set<number> = new Set<number> ();

  changeFiltreMethode(nameMethode:string){
    this.userInput='';
    this.methodeDeFiltre=nameMethode;
    if(nameMethode=='nomUtilisateur'){
      this.placeHolderText = 'Rechercher par nom d\'utilisateur ';
    }else{
      this.placeHolderText = 'Rechercher par #hashtag';
    }
  }

  resetPage(){
    window.location.reload();
  }

  onInputChange(): void {
    // Mettez en œuvre la logique pour déterminer quand afficher le menu déroulant
    
    if(this.methodeDeFiltre=='nomUtilisateur'){
      this.dropdownOptions = this.listUsers.filter(user =>
      user.identifiant.toLowerCase().includes(this.userInput.toLowerCase())
    );
    if (this.userInput.length >= 3) {
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
    }
    else if(this.methodeDeFiltre=='nomUtilisateur'){
      this.showDropdown = false;
    }
    
  }

  chooseUser(user_id:any){
    let userChoosed = this.listUsers.find(user => user.id === parseInt(user_id, 10));
    this.placeHolderText= userChoosed?.nom + ' ' + userChoosed?.prenom;
    this.userInput = this.placeHolderText;
    this.messagesService.getMessagesOfSomeone(user_id).subscribe((data)=>{
      this.listMessages = [];
      data.messages.forEach((element: any) => {
        this.bindToModelMessageAndAddToList(element);
      });
      this.totalMassages=data.messages.length;
    })
    this.cdr.detectChanges();
  }

  onEnterPressed(){
    console.log(this.selectedOption);
    if(this.methodeDeFiltre == 'hashtagMessage'){
      this.messagesService.getMessageByHashtag(this.userInput).subscribe((data)=>{
        this.listMessages = [];
        data.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
        this.totalMassages=data.messages.length;
      })
    }
    // if(this.methodeDeFiltre == 'nomUtilisateur'){
    //   let userWithIdentifiant = this.listUsers.find(user => user.identifiant === this.userInput);
      // this.messagesService.getMessagesOfSomeone(userWithIdentifiant?.id).subscribe((data)=>{
      //   this.listMessages = [];
      //   data.messages.forEach((element: any) => {
      //     this.bindToModelMessageAndAddToList(element);
      //   });
      //   this.totalMassages=data.messages.length;
    //   })
    // }
    this.cdr.detectChanges();
  }

  onTriChange(newTriMethod: string): void {
    if(newTriMethod == 'LikeDown'){
      this.messagesService.getMessagesSortedByLikesDown().subscribe((data)=>{
        this.listMessages = [];
        data.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
      })
    }else if (newTriMethod == 'LikeUp'){
      this.messagesService.getMessagesSortedByLikesUp().subscribe((data)=>{
        this.listMessages = [];
        data.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
      })
    }else if (newTriMethod == 'DateDown'){
      this.messagesService.getMessagesSortedByDateDown().subscribe((data)=>{
        this.listMessages = [];
        data.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
      })
    }else if (newTriMethod == 'DateUp'){
      this.messagesService.getMessagesSortedByDateUp().subscribe((data)=>{
        this.listMessages = [];
        data.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
      })
    }
    this.cdr.detectChanges();
  }

  ngOnInit(){
    this.userService.getAllUsersData().subscribe(
      async(response)=>{     
        for(let i=0;i<response.nbrOfUsers;i++){
          this.bindToModelUserAndAddToList(response.users[i]);
        }
      }
    )
    this.notifService.getNotification().subscribe(async(notification)=> {
      this.notificationExists=notification.hasNotification;
      this.notificationType = notification.type;
    });
    this.messagesService.getMessages().subscribe(
      async(response) =>{   
        response.messages.forEach((element: any) => {
          this.bindToModelMessageAndAddToList(element);
        });
        this.cdr.detectChanges();
        console.log(this.listMessages.length);
        this.totalMassages=this.listMessages.length;  
      });
      const storedLikes = localStorage.getItem('likedMessages');
      if(storedLikes){
          this.likedMessages = new Set<number>(JSON.parse(storedLikes));
      }

      this.webSocketService.listen('loginReussi').subscribe(async(data) => {
        this.notifService.setNotification(true,NotificationType.NewConnectionOther,'Regardez qui viens de se connecter : '+data.username);
        console.log('new Con');
      });

      this.webSocketService.listen('deconnexionReussi').subscribe(async(data) => {
        this.notifService.setNotification(true,NotificationType.NewConnectionOther,data.username+' est parti :(');
      });
      
    }

  findIdentifiantById(id:any){
    let userWithId = this.listUsers.find(user => user.id === id);
    return userWithId?.identifiant;
  } 

  

  onRangeChange(event: any) {
    this.messageParPage = event.target.value;
  }

  bindToModelMessageAndAddToList(response:any){
    this.listMessages.push(new Message(response._id,response.date,response.hour,response.body,
                            response.createdBy,response.images,response.likes,response.hashtags,
                            response.comments));
  }
  bindToModelUserAndAddToList(response:any){
    this.listUsers.push(new User(response.id,response.identifiant,response.nom,
                            response.prenom,response.avatarUrl,response.isConnected));
  }

  navigateToMessageDetails(messageId: number,message:Message) {
    this.userService.setListOfUsers(this.listUsers);
    let user = this.listUsers.find(user => user.id === message.createdBy);
    this.userService.setSelectedUser(user);
    this.messagesService.setSelectedMessage(message);
    this.router.navigate(['/message', messageId]);
  }

  isMessageLiked(messageId: number): boolean {
    return this.likedMessages.has(messageId);
  }

  likeMessage(id:any){
   if(!this.isMessageLiked(id)){ 
      this.messagesService.likeMessage(id).subscribe((response)=>{
      this.notifService.setNotification(true,NotificationType.LikeUtilisateur,'Vous avez liké le message : '+id);
      this.likedMessages.add(id);
      localStorage.setItem('likedMessages', JSON.stringify(Array.from(this.likedMessages)));
      let message  = this.listMessages.find( message => message._id == id);
        if(message){
          message.likes++;
        }
    })
  }else{
    this.messagesService.dislikeMessage(id).subscribe((response) => {
      this.likedMessages.delete(id);
      this.notifService.setNotification(true,NotificationType.DislikeUtilisateur,'Vous avez disliké le message : '+id);
      localStorage.setItem('likedMessages', JSON.stringify(Array.from(this.likedMessages)));
      let message  = this.listMessages.find( message => message._id == id);
        if(message){
          message.likes--;
        }
    })
  }
}

openShareInput(){
  this.isSharePopUp=!this.isSharePopUp;
}

finishShare(id:any){
 const userId = localStorage.getItem('id');
 this.messagesService.shareMessage(id,userId,this.shareContent).subscribe((data)=>{
  console.log(data);
  this.openShareInput();
  this.notifService.setNotification(true,NotificationType.PartageUtilisateur,'Vous avez partagé le message : '+id);
 })
 this.cdr.detectChanges();
}

}
