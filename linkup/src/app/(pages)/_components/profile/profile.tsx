'use client';
import ProfileForm from './profileForm/profileForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

function MainPage() {
  return (
    <div>
      <Header />
      <NameSection />
      <AboutMe />
      <StudyInterest />
    </div>
  );
}

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative h-[324px] w-full max-w-[1700px] mx-auto">
      {/* Blue bar */}
      <div className="absolute top-[72px] w-full h-[154px] bg-[#002855]"></div> 

      {/* Logo */}
      <div className="absolute w-[169px] h-[41px] top-[15px] left-[12px]">
        <img src="logo.svg" alt="logo" className="w-full h-full object-cover" />
      </div>

      {/* Back to Dashboard button */}
      <Link href="/dashboard">
        <div
          className="absolute w-[250px] h-[54px] top-[122px] right-[222px] rounded-[10px]
          border-2 border-[#F5F5F5] bg-white cursor-pointer hover:bg-gray-100 hover:shadow-md"
        >
          <div className="absolute w-[230px] h-[32px] top-[10px] left-[10px]">
            <img src="BacktoDashboard.svg" alt="back to dashboard" className="w-full h-full object-cover" />
          </div>
        </div>
      </Link>

      {/* Edit Profile button opens modal */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="absolute w-[170px] h-[54px] top-[122px] right-[28px] rounded-[10px]
        border-2 border-white cursor-pointer hover:bg-[#0a3463] hover:shadow-md"
      >
        <div className="absolute w-[149px] h-[32px] top-[10px] left-[10px]">
          <img src="EditProfile.svg" alt="edit profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* User's photo */}
      <div className="absolute top-[146px] left-[61px] w-[172px] h-[172px] rounded-full border-[5px] border-white overflow-hidden">
        <img
          src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
          alt="head"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fullscreen Modal with ProfileForm */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50
              backdrop-filter backdrop-blur-md"
        >
          <div className="bg-white w-full max-w-[1440px] relative overflow-auto rounded-lg">
            <ProfileForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function NameSection() {
  const [verified, setVerified] = useState(false);

  function toggleVerified() {
    setVerified(!verified);
  }

  return (
    <div className="relative mb-10 ml-16 max-w-[1700px] mx-auto">
      {/* User's name */}
      <p className="relative font-inter font-semibold text-[50px] leading-[35px] mb-3 align-middle tracking-[0px]">
        User Name
      </p>
      {/* User's major */}
      <p className="relative ml-1 font-inter font-medium text-[25px] leading-[25px] tracking-[0px] align-middle">
        User's Major
      </p>
      {/* User's year */}
      <p className="relative ml-1 font-inter font-medium text-[25px] leading-[25px] tracking-[0px] align-middle">
        nth Year
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

function AboutMe() {
  return (
    <div className="relative mb-8 ml-16 max-w-[1700px] mx-auto">
      {/* About Me Title */}
      <div className="relative font-inter font-semibold text-[25px] align-middle ">
        About Me
      </div>
      {/* Introduction */}
      <div className="relative w-[90%] font-inter font-normal text-[20px] align-middle">
        I'm a Computer Science major passionate about Web Dev and AI. 
        I enjoy collaborative studying and helping others understand complex concepts. 
        Looking for study partners for algorithm analysis and database design courses. 
        I'm also open to parallel play studying to keep each other accountable!
      </div>
    </div>
  );
}

function StudyInterest() {
  return (
    <div className="flex ml-16 mb-24 max-w-[1200px] mx-auto">
      {/* Study Interest */}
      <div className="w-[45%]">
        <p className="font-inter font-semibold text-[25px] leading-[50px] tracking-[0px] align-middle mb-1">
          Study Interests
        </p>

        {/* Interest bubbles */}
        <div className="flex flex-wrap gap-4">
          <div className="w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]">
            <div className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]">
              Algorithms
            </div>
          </div>

          <div className="w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]">
            <div className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]">
              Web Developing and 32432432424
            </div>
          </div>

          <div className="w-max px-3 py-0.5 rounded-[20px] border border-[#6B819B]">
            <div className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#002855]">
              Large Language Model
            </div>
          </div>
        </div>
      </div>

      {/* Blank Block */}
      <div className="w-[15%]"></div>

      {/* Study Preference */}
      <div className="w-[30%]">
        <p className="font-inter font-semibold text-[25px] leading-[50px] tracking-[0px] align-middle mb-2">
          Study Preferences
        </p>
        <p className="font-inter font-normal text-[20px] leading-[20px] tracking-[0px] align-middle mb-5">
          Collaborative Style
        </p>
        <p className="font-inter font-normal text-[20px] leading-[20px] tracking-[0px] align-middle mb-5">
          Group Preference
        </p>
      </div>
    </div>
  );
}

// make sure that the profile info comes from the user's profile in the database
// make sure the styling is consistent with the Figma design
// once again this is broken up into too many components, but work with what you have.
export default function Profile() {
  return (
    <div className="h-[96vh] w-full bg-gray-100 bg-opacity-30 backdrop-filter backdrop-blur-sm flex justify-center">
      <div className="relative w-full bg-white max-w-[1700px] mx-auto p-4">
        <MainPage />
      </div>
    </div>
    
  );
}
