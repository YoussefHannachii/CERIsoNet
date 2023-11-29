export class Message{
    _id: number;
    date: string;
    hour: string;
    body: string;
    createdBy: number;
    image: {
      url: string;
      title: string;
    };
    likes: number;
    hashtags: string[];
    comments: {
      text: string;
      commentedBy: number;
      date: string;
      hour: string;
    }[];
  
    constructor(
      _id: number,
      date: string,
      hour: string,
      body: string,
      createdBy: number,
      image: { url: string; title: string },
      likes: number,
      hashtags: string[],
      comments: { text: string; commentedBy: number; date: string; hour: string }[]
    ) {
      this._id = _id;
      this.date = date;
      this.hour = hour;
      this.body = body;
      this.createdBy = createdBy;
      this.image = image;
      this.likes = likes;
      this.hashtags = hashtags;
      this.comments = comments;
    }
}