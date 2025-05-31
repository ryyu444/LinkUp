import { GeoPoint, Timestamp } from 'firebase/firestore';
import User from '../auth/User';
import Tag from './Tag';

// can add more fields
export default interface Session {
  title: String;
  description: String;
  day: String,
  startTime: Date;
  endTime: Date;
  location: String;
  noise: Number, // maybe map 0->3 to Silent->Collaborative
  capacity: Number;
  registered: User[];
  tags: Tag[]; // additional preferences, etc
}
