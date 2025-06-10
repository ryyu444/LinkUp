import User from '../auth/User';
import Tag from './Tag';

// can add more fields
export default interface Session {
  host: string;
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
  host: User;
}
