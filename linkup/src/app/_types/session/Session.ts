import Tag from './Tag';

interface Host {
  uuid: string; // unique identifier for the host
  displayName: string;
  profilePicture?: string; // optional, can be undefined if not set
}

// can add more fields
export default interface Session {
  host: User;
  sessionID: string; // unique session ids
  title: String;
  description: String;
  day: String,
  startTime: Date;
  endTime: Date;
  location: String;
  noise: Number, // maybe map 0->3 to Silent->Collaborative
  capacity: number;
  registered: String[]; // array of user UUIDS
  tags: Tag[]; // additional preferences, 
}
