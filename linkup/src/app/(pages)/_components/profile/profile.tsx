'use client';
import ProfileForm from './profileForm/profileForm';
import { useState, useEffect } from 'react';
import { getFirebaseAuth, getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

function MainPage() {
  const [userData, setUserData] = useState<any>({
    name: 'Anonymous',
    major: 'Unknown Major',
    year: 'nth Year',
    profileImageUrl: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
    subjects: [],
    biography: '',
    groupSize: '',
    studyPreference: '',
  });

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDB();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Fetched user data:', userData);
        setUserData({
          name: userData.name || 'Anonymous',
          major: userData.major || 'Unknown Major',
          year: userData.year || 'nth Year',
          profileImageUrl: userData.profileImageUrl || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
          subjects: userData.subjects || [],
          biography: userData.biography || '',
          groupSize: userData.groupSize || '',
          studyPreference: userData.studyPreference || '',
        });
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <Header userData={userData} refreshUserData={fetchUserProfile} />
      <NameSection userData={userData} />
      <AboutMe bio={userData.biography} />
      <StudyInterest 
        subjects={userData.subjects} 
        groupSize={userData.groupSize} 
        studyPreference={userData.studyPreference} 
      />
    </div>
  );
}

function Header({ userData, refreshUserData }: { userData: any, refreshUserData: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Changed to false so modal doesn't open by default

  return (
    <div className="relative h-[252px] w-full max-w-[9999px] mx-auto">
      {/* Blue bar */}
      <div className="absolute top-[0px] w-full h-[154px] bg-[#002855]"></div>

      {/* Back to Dashboard button */}
      <Link href="/dashboard">
        <div className="absolute w-[250px] h-[54px] top-[50px] right-[222px] rounded-[10px]
        border-2 border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-100 hover:shadow-md">
          <div className="absolute w-[230px] h-[32px] top-[10px] left-[10px]">
            <img src="BacktoDashboard.svg" alt="back to dashboard" className="w-full h-full object-cover" />
          </div>
        </div>
      </Link>

      {/* Edit Profile button opens modal */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="absolute w-[170px] h-[54px] top-[50px] right-[28px] rounded-[10px]
        border-2 border-white cursor-pointer hover:bg-[#0a3463] hover:shadow-md"
      >
        <div className="absolute w-[149px] h-[32px] top-[10px] left-[10px]">
          <img src="EditProfile.svg" alt="edit profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* User's photo */}
      <div className="absolute top-[74px] left-[61px] w-[172px] h-[172px] rounded-full border-[5px] border-white overflow-hidden">
        <img
          src={userData.profileImageUrl}
          alt="head"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fullscreen Modal with ProfileForm */}
      {isModalOpen && (
        <div className="fixed inset-0 flex z-50 backdrop-filter backdrop-blur-md justify-center">
          <div className="bg-white w-full max-w-[1440px] relative overflow-auto">
            <ProfileForm onClose={() => setIsModalOpen(false)} refreshUserData={refreshUserData} />
          </div>
        </div>
      )}
    </div>
  );
}

function NameSection({ userData }: { userData: any }) {
  const [verified, setVerified] = useState(false);

  function toggleVerified() {
    setVerified(verified);
  }

  return (
    <div className="relative mb-14 ml-16 max-w-[9999px] mx-auto">
      {/* User's name */}
      <p className="relative font-inter font-semibold text-[50px] leading-[35px] mb-3 align-middle tracking-[0px]">
        {userData.name}
      </p>
      {/* User's major */}
      <p className="relative ml-1 font-inter font-medium text-[25px] leading-[25px] tracking-[0px] align-middle">
        {userData.major}
      </p>
      {/* User's year */}
      <p className="relative ml-1 font-inter font-medium text-[25px] leading-[25px] tracking-[0px] align-middle">
        {userData.year}
      </p>

      {/* Student verification */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleVerified}
        className={`absolute right-[3%] top-1/2 -translate-y-1/2 w-[132px] h-[54px] rounded-[10px] cursor-pointer
          ${verified ? 'bg-[#79fbd1]' : 'bg-[#F5F5F5]'}
          flex items-center justify-center
        `}
      >
        <div className="w-[113px] h-[32px]">
          <img
            src="StudentVerify.svg"
            alt="Student"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function AboutMe({ bio }: { bio: string }) {
  console.log('Biography:', bio); // Check if bio is being passed correctly
  return (
    <div className="relative mb-10 ml-16 max-w-[9999px] mx-auto">
      <div className="relative font-inter font-semibold text-[25px] align-middle">
        About Me
      </div>
      <div className="relative w-[90%] font-inter font-normal text-[20px] align-middle">
        {bio || 'The user has not entered a biography yet.'}  {/* Add fallback if bio is empty */}
      </div>
    </div>
  );
}


function StudyInterest({ subjects, groupSize, studyPreference }: { subjects: string[], groupSize: string, studyPreference: string }) {
  return (
    <div className="flex ml-16 mb-24 max-w-[1200px] mx-auto">
      {/* Study Interest */}
      <div className="w-[45%]">
        <p className="font-inter font-semibold text-[25px] leading-[50px] tracking-[0px] align-middle mb-1">
          Study Interests
        </p>

        {/* Interest bubbles dynamically created from subjects */}
        <div className="flex flex-wrap gap-4">
          {(subjects && subjects.length > 0) ? (
            subjects.map((subject, index) => (
              <div key={index} className="w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]">
                <div className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]">
                  {subject}
                </div>
              </div>
            ))
          ) : (
            <div className="w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]">
              <div className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]">
                No subjects added
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blank Block */}
      <div className="w-[15%]"></div>

      {/* Study Preference */}
      <div className="w-[30%]">
        <p className="font-inter font-semibold text-[25px] leading-[50px] tracking-[0px] align-middle mb-2">
          Study Preferences
        </p>

        {/* Study Preference */}
        <div className="flex items-center mb-5">
          <img src="sound.svg" alt="Study Preference" className="w-[29px] h-[29px] mr-2" />
          <p className="font-inter font-normal text-[20px] leading-[20px] tracking-[0px] align-middle">
            {studyPreference || 'No study preference specified'}
          </p>
        </div>

        {/* Group Size */}
        <div className="flex items-center mb-5">
          <img src="groupsize.svg" alt="Group Size" className="w-[29px] h-[29px] mr-2" />
          <p className="font-inter font-normal text-[20px] leading-[20px] tracking-[0px] align-middle">
            {groupSize || 'No group size preference specified'}
          </p>
        </div>
        
      </div>
    </div>
  );
}





// Make sure that the profile info comes from the user's profile in the database
// Make sure the styling is consistent with the Figma design
// Once again this is broken up into too many components, but work with what you have.
export default function Profile() {
  return (
    <div className="h-[96vh] w-full bg-gray-100 bg-opacity-30 backdrop-filter backdrop-blur-sm flex justify-center">
      <div className="relative w-full bg-white max-w-[9999px] mx-auto p-4">
        <MainPage />
      </div>
    </div>
  );
}
