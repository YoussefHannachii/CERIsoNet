import { ChangeDetectorRef, Component } from '@angular/core';
import { MessagesServiceService } from 'src/app/service/messages-service.service';
import { NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';
import { UserServiceService } from 'src/app/service/user-service.service';
import { User } from 'src/app/models/user';
import { NotificationService,NotificationType } from 'src/app/service/notification.service';

//CE COMPONENT REPRESENTE LES MESSAGE DE NOTRE APPLICATIONN , J'AI JUSTE UTILISER POUR TESTER
@Component({
  selector: 'app-message-application',
  templateUrl: './message-application.component.html',
  styleUrls: ['./message-application.component.css']
})
export class MessageApplicationComponent {

  selectedMessage!:Message;
  selectedUser!:User;
  listOfUsers! : User[];
  displayedComments!: any[]; 
  commentsToShow = 8;
  notificationExists!:boolean;
  isHovered = false;
  commentContent!:string;
  isSharePopUp=false;
  shareContent!:string;

  likedMessages : Set<number> = new Set<number> ();


  constructor(private messagesService:MessagesServiceService,
              private route:ActivatedRoute,
              private userService : UserServiceService,
              private notifiService : NotificationService,
              private cdr: ChangeDetectorRef){}

  ngOnInit(){
  this.listOfUsers = this.userService.getListOfUsers();
  this.bindToMessageModel(this.messagesService.getSelectedMessage());
  this.bindToUserModel(this.userService.getSelectedUser());
  this.updateDisplayedComments();
  this.notifiService.getNotification().subscribe((notification)=>{
    this.notificationExists = notification.hasNotification;
  })
  const storedLikes = localStorage.getItem('likedMessages');
      if(storedLikes){
          this.likedMessages = new Set<number>(JSON.parse(storedLikes));
      }
  }

  findIdentifiantById(id:any){
    let userWithId = this.listOfUsers.find(user => user.id === id);
    return userWithId?.identifiant;
  } 

  getAvatarUrl(id:any){
    let userWithId = this.listOfUsers.find(user => user.id === id);
    return userWithId?.avatarUrl;
  }

  bindToMessageModel(message:any){
    this.selectedMessage = new Message(message._id,message.date,message.hour,message.body,
                                      message.createdBy,message.image,message.likes,message.hashtags,
                                      message.comments)
  }
  
  bindToUserModel(user:any){
    this.selectedUser = new User(user.id,user.identifiant,user.nom,user.prenom,
                                  user.avatarUrl,user.isConnected);
  }

  updateDisplayedComments() {
    if (this.selectedMessage && this.selectedMessage.comments) {
      this.displayedComments = this.selectedMessage.comments.slice(0, this.commentsToShow);
    }
  }

  showMoreComments() {
    this.commentsToShow += 5; // ou le nombre que vous préférez
    this.displayedComments = this.selectedMessage.comments.slice(0, this.commentsToShow);
  }

  isMessageLiked(messageId: number): boolean {
    return this.likedMessages.has(messageId);
  }

  likeMessage(id:any){
   if(!this.isMessageLiked(id)){ 
      this.messagesService.likeMessage(id).subscribe((response)=>{
      this.notifiService.setNotification(true,NotificationType.LikeUtilisateur,'Vous avez liké le message : '+id);
      this.likedMessages.add(id);
      localStorage.setItem('likedMessages', JSON.stringify(Array.from(this.likedMessages)));
      this.selectedMessage.likes++;
    })
  }else{
    this.messagesService.dislikeMessage(id).subscribe((response) => {
      this.likedMessages.delete(id);
      this.notifiService.setNotification(true,NotificationType.DislikeUtilisateur,'Vous avez disliké le message : '+id);
      localStorage.setItem('likedMessages', JSON.stringify(Array.from(this.likedMessages)));
      this.selectedMessage.likes--; 
    })
  }
  }

  finishComment(){
    const userId = localStorage.getItem('id');
    this.messagesService.commentMessage(this.selectedMessage._id,userId,this.commentContent).subscribe((data)=>{
      this.notifiService.setNotification(true,NotificationType.CommentUtilisateur,'Vous avez commenté le message : '+this.selectedMessage._id);
      this.cdr.detectChanges();
    })
  }
  openShareInput(){
    this.isSharePopUp=!this.isSharePopUp;
  }
  
  finishShare(){
   const userId = localStorage.getItem('id');
   this.messagesService.shareMessage(this.selectedMessage._id,userId,this.shareContent).subscribe((data)=>{
    console.log(data);
    this.openShareInput();
    this.notifiService.setNotification(true,NotificationType.PartageUtilisateur,'Vous avez partagé le message : '+this.selectedMessage._id);
   })
   this.cdr.detectChanges();
  }

}
