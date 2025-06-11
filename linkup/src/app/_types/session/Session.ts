import Tag from './Tag';

interface Host {
  uuid: string; // unique identifier for the host
  displayName: string;
  profilePicture?: string; // optional, can be undefined if not set
}

// can add more fields
export default interface Session {
  host: Host;
  sessionID: string; // unique session ids
  title: string;
  description: string;
  day: string,
  startTime: Date;
  endTime: Date;
  location: string;
  noise: number, // maybe map 0->3 to Silent->Collaborative
  capacity: number;
  registered: string[]; // array of user UUIDS
  tags: Tag[]; // additional preferences, etc
}
