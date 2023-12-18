export class User{
    id:number;
    identifiant:string;
    nom:string;
    prenom:string;
    avatarUrl:string;
    isConnected:number;
  
    constructor(
        id:number,
        identifiant:string,
        nom:string,
        prenom:string,
        avatarUrl:string,
        isConnected:number
    ) {
      this.id = id;
      this.identifiant=identifiant;
      this.nom=nom;
      this.prenom=prenom;
      this.avatarUrl=avatarUrl;
      this.isConnected=isConnected;
    }
}