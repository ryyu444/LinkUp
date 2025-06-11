export default interface User {
  uuid: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
  provider: string;
  profilePicture?: string; // Optional field for profile picture URL
  bio?: string; // Optional field for user bio
  major?: string; // Optional field for user major
  year?: string; // Optional field for user year (e.g., Freshman, Sophomore)
  noisePreference?: string; // Optional field for noise preference (e.g., Silent, Collaborative)
  groupSize?: number; // Optional field for preferred group size
  registeredSessions?: string[]; // Optional field for sessions the user is registered in
  subjects?: string[]; // Optional field for subjects the user is interested in
  firstTimeUser: boolean; // Indicates if the user has completed their profile
}
