export default interface User {
  uuid: String;
  email: String | null;
  displayName: String | null;
  createdAt: Date;
  provider: String;
  profilePicture?: String | null; // Optional field for profile picture URL
  bio?: String | null; // Optional field for user bio
  major?: String | null; // Optional field for user major
  year?: String | null; // Optional field for user year (e.g., Freshman, Sophomore)
  noisePreference?: String | null; // Optional field for noise preference (e.g., Silent, Collaborative)
  groupSize?: Number | null; // Optional field for preferred group size
  registeredSessions?: String[]; // Optional field for sessions the user is registered in
}
