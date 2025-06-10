'use client';

import { AuthContext } from '../../_contexts/AuthContext';
import { useState, useEffect, useContext } from 'react';
import { getFirebaseAuth, getFirebaseDB } from '@/(api)/_lib/firebase/firebaseClient';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import User from '@/app/_types/auth/User';
import ProfileForm from './profileForm/profileForm';
import Link from 'next/link';

function MainPage() {
  const [userData, setUserData] = useState<any>({
    displayName: 'Anonymous',
    major: 'Unknown Major',
    year: 'nth Year',
    profilePicture:
      'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
    subjects: [],
    bio: '',
    preferredGroupSize: '',
    noisePreference: '',
    profileSaved: false,
  });

  const auth = getFirebaseAuth();
  const db = getFirebaseDB();

  function convertGroupSizeToString(value: number): string {
    switch (value) {
      case 2:
        return '1 on 1 (2 People)';
      case 4:
        return 'Small Groups (2-4 People)';
      case 8:
        return 'Large Groups (5+ People)';
      default:
        return '';
    }
  }

  const fetchUserProfile = async () => {
    const { user } = useContext(AuthContext);

    if (user) {
      const userCol = collection(db, 'users');
      const userSnapshot = await getDocs(userCol);
      // Fetch the user document using the user's UUID
      const userData = userSnapshot.docs
        .map((doc) => doc.data() as User)
        .filter((u) => u.uuid === user.uuid)[0];

      setUserData({
        displayName: userData.displayName || 'Anonymous',
        major: userData.major || 'Unknown Major',
        year: userData.year || 'nth Year',
        profilePicture:
          userData.profilePicture ||
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
        subjects: userData.subjects || [],
        bio: userData.bio || '',
        preferredGroupSize: convertGroupSizeToString(userData?.groupSize || 0),
        noisePreference: userData.noisePreference || '',
        profileSaved: userData.profileSaved || false,
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <Header
        userData={userData}
        refreshUserData={fetchUserProfile}
        auth={auth}
        db={db}
      />
      <NameSection userData={userData} />
      <AboutMe bio={userData.bio} />
      <StudyInterest
        subjects={userData.subjects}
        preferredGroupSize={userData.preferredGroupSize}
        noisePreference={userData.noisePreference}
      />
    </div>
  );
}

function Header({
  userData,
  refreshUserData,
  auth,
  db,
}: {
  userData: any;
  refreshUserData: () => void;
  auth: any;
  db: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Default to false

  // Set initial modal state based on profileSaved, only on first load
  useEffect(() => {
    const checkProfileSaved = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const profileSaved = data.profileSaved || false;
          setIsModalOpen(!profileSaved); // Open modal only if profileSaved is false
        }
      }
    };

    checkProfileSaved();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div className='relative h-[252px] w-full max-w-[9999px] mx-auto'>
      {/* Blue bar */}
      <div className='absolute top-[0px] w-full h-[154px] bg-[#002855]'></div>

      {/* Back to Dashboard button */}
      <Link href='/dashboard'>
        <div
          className='absolute w-[250px] h-[54px] top-[50px] right-[222px] rounded-[10px]
        border-2 border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-100 hover:shadow-md'
        >
          <div className='absolute w-[230px] h-[32px] top-[10px] left-[10px]'>
            <img
              src='BacktoDashboard.svg'
              alt='back to dashboard'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </Link>

      {/* Edit Profile button opens modal */}
      <div
        onClick={() => setIsModalOpen(true)}
        className='absolute w-[170px] h-[54px] top-[50px] right-[28px] rounded-[10px]
        border-2 border-white cursor-pointer hover:bg-[#0a3463] hover:shadow-md'
      >
        <div className='absolute w-[149px] h-[32px] top-[10px] left-[10px]'>
          <img
            src='EditProfile.svg'
            alt='edit profile'
            className='w-full h-full object-cover'
          />
        </div>
      </div>

      {/* User's photo */}
      <div className='absolute top-[74px] left-[61px] w-[172px] h-[172px] rounded-full border-[5px] border-white overflow-hidden'>
        <img
          src={userData.profilePicture}
          alt='head'
          className='w-full h-full object-cover'
        />
      </div>

      {/* Fullscreen Modal with ProfileForm */}
      {isModalOpen && (
        <div className='fixed inset-0 flex z-50 backdrop-filter backdrop-blur-md justify-center'>
          <div className='bg-white w-full max-w-[1440px] relative overflow-auto'>
            <ProfileForm
              onClose={() => setIsModalOpen(false)}
              refreshUserData={refreshUserData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NameSection({ userData }: { userData: any }) {
  const [verified, setVerified] = useState(false);

  function toggleVerified() {
    setVerified(!verified); // Fixed: Toggle the verified state correctly
  }

  return (
    <div className='relative mb-14 ml-16 max-w-[9999px] mx-auto'>
      {/* User's name */}
      <p className='relative font-inter font-semibold text-[50px] leading-[35px] mb-3 align-middle tracking-[0px]'>
        {userData.displayName}
      </p>
      {/* User's major */}
      <p className='relative ml-1 font-inter font-medium text-[25px] leading-[25px] tracking-[0px] align-middle'>
        {userData.major}
      </p>
      {/* User's year */}
      <p className='relative ml-1 font-inter font-medium text-[25px] leading-[25px] tracking-[0px] align-middle'>
        {userData.year}
      </p>

      {/* Student verification */}
      <div
        role='button'
        tabIndex={0}
        onClick={toggleVerified}
        className={`absolute right-[3%] top-1/2 -translate-y-1/2 w-[132px] h-[54px] rounded-[10px] cursor-pointer
          ${verified ? 'bg-[#79fbd1]' : 'bg-[#F5F5F5]'}
          flex items-center justify-center
        `}
      >
        <div className='w-[113px] h-[32px]'>
          <img
            src='StudentVerify.svg'
            alt='Student'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
}

function AboutMe({ bio }: { bio: string }) {
  return (
    <div className='relative mb-10 ml-16 max-w-[9999px] mx-auto'>
      <div className='relative font-inter font-semibold text-[25px] align-middle'>
        About Me
      </div>
      <div className='relative w-[90%] font-inter font-normal text-[20px] align-middle'>
        {bio || 'The user has not entered a biography yet.'}{' '}
        {/* Add fallback if bio is empty */}
      </div>
    </div>
  );
}

function StudyInterest({
  subjects,
  preferredGroupSize,
  noisePreference,
}: {
  subjects: string[];
  preferredGroupSize: string;
  noisePreference: string;
}) {
  return (
    <div className='flex ml-16 mb-24 max-w-[1400px] mx-auto'>
      {/* Study Interest */}
      <div className='w-[45%]'>
        <p className='font-inter font-semibold text-[25px] leading-[50px] tracking-[0px] align-middle mb-1'>
          Study Interests
        </p>

        {/* Interest bubbles dynamically created from subjects */}
        <div className='flex flex-wrap gap-4'>
          {subjects && subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <div
                key={index}
                className='w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]'
              >
                <div className='font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]'>
                  {subject}
                </div>
              </div>
            ))
          ) : (
            <div className='w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]'>
              <div className='font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]'>
                No subjects added
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blank Block */}
      <div className='w-[15%]'></div>

      {/* Study Preference */}
      <div className='w-[30%]'>
        <p className='font-inter font-semibold text-[25px] leading-[50px] tracking-[0px] align-middle mb-2'>
          Study Preferences
        </p>

        {/* Study Preference */}
        <div className='flex items-center mb-5'>
          <img
            src='sound.svg'
            alt='Study Preference'
            className='w-[29px] h-[29px] mr-2'
          />
          <p className='font-inter font-normal text-[20px] leading-[20px] tracking-[0px] align-middle'>
            {noisePreference || 'No study preference specified'}
          </p>
        </div>

        {/* Group Size */}
        <div className='flex items-center mb-5'>
          <img
            src='groupsize.svg'
            alt='Group Size'
            className='w-[29px] h-[29px] mr-2'
          />
          <p className='font-inter font-normal text-[20px] leading-[20px] tracking-[0px] align-middle'>
            {preferredGroupSize || 'No group size specified'}
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
    <div className='h-[92vh] w-full bg-gray-100 bg-opacity-30 backdrop-filter backdrop-blur-sm flex justify-center'>
      <div className='relative w-full bg-white max-w-[9999px] mx-auto'>
        <MainPage />
      </div>
    </div>
  );
}
