import { GeoPoint, Timestamp } from 'firebase/firestore';
import Tag from './Tag';

// can add more fields
export default interface Event {
  title: String;
  description: String;
  date: Timestamp;
  location: GeoPoint;
  capacity: Number;
  tags: Tag[]; // additional preferences, etc
}
