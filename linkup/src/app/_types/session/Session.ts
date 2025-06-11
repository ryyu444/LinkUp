import Tag from './Tag';

interface Host {
  displayName: String;
  profilePicture?: String;
}

// can add more fields
export default interface Session {
  host: Host; // host of the session
  sessionID: String; // unique session ids
  title: String;
  description: String;
  day: String,
  startTime: Date;
  endTime: Date;
  location: String;
  noise: Number, // maybe map 0->3 to Silent->Collaborative
  capacity: Number;
  registered: String[]; // array of user UUIDS
  tags: Tag[]; // additional preferences, etc
}
