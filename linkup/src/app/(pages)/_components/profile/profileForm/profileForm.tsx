import { useState, useEffect } from 'react';
import {
  getFirebaseAuth,
  getFirebaseDB,
} from '@/(api)/_lib/firebase/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Component props interfaces for type safety
interface ProfileFormProps {
  onClose: () => void;
  refreshUserData: () => void;
}

interface MainPageProps {
  onClose: () => void;
  className?: string;
  profilePictureUrl: string;
  setprofilePictureUrl: React.Dispatch<React.SetStateAction<string>>;
  refreshUserData: () => void;
}

// Main ProfileForm component: Entry point for the profile editing UI
function ProfileForm({ onClose, refreshUserData }: ProfileFormProps) {
  // State for managing profile image with a default placeholder
  const [profilePictureUrl, setprofilePictureUrl] = useState(
    'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
  );

  return (
    <div className='relative w-full h-full top-0 left-0 bg-white flex flex-col items-center border-l border-r'>
      {/* Container for centering content with max width */}
      <div className='relative w-full max-w-[1440px] h-full px-4'>
        <Header />
        <MainPage
          onClose={onClose}
          profilePictureUrl={profilePictureUrl}
          setprofilePictureUrl={setprofilePictureUrl}
          refreshUserData={refreshUserData} // for Main Page refresh
        />
      </div>
    </div>
  );
}

// Export the ProfileForm as the default component
export default ProfileForm;

// Header component: Displays the title and subtitle for the profile form
function Header() {
  return (
    <div className='mt-[72px] w-full h-[100px] flex flex-col items-center justify-center'>
      {/* Main title */}
      <p className='font-inter font-semibold text-[60px] leading-[50px] mb-7 text-[#002855] text-center align-middle'>
        Edit Your Profile
      </p>
      {/* Subtitle with purpose explanation */}
      <p className='font-inter font-semibold text-[20px] leading-[20px] text-center align-middle text-[#002855]'>
        Tell us about yourself
      </p>
    </div>
  );
}

// MainPage component: Organizes the layout into left and right sections
function MainPage({
  onClose,
  profilePictureUrl,
  setprofilePictureUrl,
  className,
  refreshUserData,
}: MainPageProps) {
  return (
    <div
      className={`relative flex w-full h-full max-w-[1330px] mx-auto px-4 pt-[20px] ${
        className || ''
      }`}
      style={{ paddingTop: '20px' }}
    >
      {/* Left side for profile image upload */}
      <Leftside
        profilePictureUrl={profilePictureUrl}
        setprofilePictureUrl={setprofilePictureUrl}
        className='w-[30%]'
      />
      {/* Right side for profile details form */}
      <Rightside
        onClose={onClose}
        profilePictureUrl={profilePictureUrl}
        setprofilePictureUrl={setprofilePictureUrl}
        className='w-[70%] ml-4'
        refreshUserData={refreshUserData} // Pass to Rightside
      />
    </div>
  );
}

// Leftside component: Handles profile image display and upload
function Leftside({
  profilePictureUrl,
  setprofilePictureUrl,
  className,
}: {
  profilePictureUrl: string;
  setprofilePictureUrl: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  // Handler for image upload via URL prompt
  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const url = prompt('Enter Your Image URL:');

    if (url) {
      const img = new Image();
      img.onload = () => {
        setprofilePictureUrl(url);
      };
      img.onerror = () =>
        alert('Invalid URL. Please try again with a valid image URL.');
      img.src = url;
    }
  };

  return (
    <div className={`${className} h-full flex flex-col items-end p-4`}>
      {/* Profile image display */}
      <div className='w-full max-w-[360px] aspect-square rounded-full overflow-hidden border-[1px] border-[#002855] mb-4'>
        <img
          src={profilePictureUrl}
          alt='Profile'
          className='w-full h-full object-cover'
        />
      </div>

      {/* Button to trigger image upload */}
      <button
        onClick={handleUploadClick}
        className='w-full max-w-[360px] h-[60px] rounded-[5px] bg-[#F5F5F5] text-[#002855] 
        font-inter font-semibold text-[20px] leading-[25px]
        flex items-center justify-center gap-3 hover:bg-gray-200'
      >
        <img src='ImageUpload.svg' alt='Upload' className='w-[37px] h-[37px]' />
        Upload Image
      </button>
    </div>
  );
}

// Rightside component: Contains form fields for profile details
function Rightside({
  onClose,
  profilePictureUrl,
  setprofilePictureUrl,
  className,
  refreshUserData,
}: ProfileFormProps & {
  className?: string;
  profilePictureUrl: string;
  setprofilePictureUrl: React.Dispatch<React.SetStateAction<string>>;
  refreshUserData: () => void;
}) {
  // State variables for form inputs
  const [displayName, setdisplayName] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selected, setSelected] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [firstTimeUser, setFirstTimeUser] = useState(false);

  // Predefined options for dropdowns and buttons
  const years = ['1st year', '2nd year', '3rd year', '4th year'];
  const options = ['Quiet', 'Some Noise', 'Collaborative'];
  const groupSizes = [
    { label: '1 on 1', value: 2 },
    { label: 'Small (2-4)', value: 4 },
    { label: 'Large (5+)', value: 8 },
  ];

  // Effect to fetch existing profile data from Firebase
  useEffect(() => {
    const fetchProfileData = async () => {
      const auth = getFirebaseAuth();
      const db = getFirebaseDB();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setdisplayName(userData.displayName || '');
          setMajor(userData.major || '');
          setSelectedYear(userData.year || '');
          setBio(userData.bio || '');
          setSubjects(userData.subjects || []);
          setSelected(userData.noisePreference || '');
          setSelectedSize(userData.groupSize || 0);

          // Only set profile picture if user hasn’t uploaded a new one yet
          setprofilePictureUrl((prev) =>
            prev ===
            'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
              ? userData.profilePicture || prev
              : prev
          );

          setFirstTimeUser(userData.firstTimeUser);
        }
      }
    };

    fetchProfileData();
  }, []);

  // Handler to add a new subject to the list
  const handleAddClick = () => {
    if (inputValue.trim()) {
      setSubjects([...subjects, inputValue]);
      setInputValue('');
    }
  };

  // Handler to remove a subject from the list
  const handleDeleteClick = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // Function to save profile data to Firebase
  const handleSaveProfile = async () => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDB();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log('No authenticated user found.');
      return;
    }

    // Check for required fields
    const isValidProfile =
      displayName.trim() !== '' &&
      major.trim() !== '' &&
      selectedYear.trim() !== '' &&
      bio.trim() !== '' &&
      selected.trim() !== '' &&
      selectedSize !== 0 &&
      subjects.length > 0;

    const profileData = {
      displayName,
      major,
      year: selectedYear,
      bio,
      noisePreference: selected,
      groupSize: selectedSize,
      subjects,
      email: currentUser.email,
      profilePicture: profilePictureUrl,
      firstTimeUser: isValidProfile, // this check is what determines if the popup shows
    };

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, profileData, { merge: true });

      setFirstTimeUser(isValidProfile);
      onClose();
      refreshUserData();
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  // Handler for skipping profile edits with blank data
  const handleSkip = async () => {
    if (firstTimeUser) {
      onClose();
      refreshUserData(); // Trigger refresh on skip
      return;
    }

    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log('No authenticated user found.');
      return;
    }

    onClose();
    refreshUserData();
  };

  return (
    <div className={`${className} h-full`}>
      {/* Full Name Section */}
      <div className='relative w-full max-w-[770px]'>
        <p className='font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-4'>
          Full Name
        </p>
        <input
          type='text'
          value={displayName}
          onChange={(e) => setdisplayName(e.target.value)}
          className='rounded-[5px] border border-[#6B819B] px-3 py-2 font-inter text-[24px] leading-[50px] outline-none mb-3 w-full'
        />
      </div>

      {/* Major and Year Section */}
      <div className='relative flex w-full max-w-[770px] gap-4'>
        {/* Major input */}
        <div className='w-3/5'>
          <p className='font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-3'>
            Major
          </p>
          <input
            type='text'
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className='rounded-[5px] border border-[#6B819B] px-3 py-2 font-inter text-[24px] leading-[50px] outline-none mb-3 w-full'
          />
        </div>

        {/* Year selection dropdown */}
        <div className='w-2/5'>
          <p className='font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-3'>
            Year
          </p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className='w-full h-[69px] border border-[#6B819B] rounded-[5px] font-inter text-[24px] leading-[50px] px-4 outline-none'
          >
            <option value='' disabled>
              Select Year
            </option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Biography Section */}
      <div className='relative w-full max-w-[770px]'>
        <p className='font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-3'>
          About Yourself
        </p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className='rounded-[5px] border border-[#6B819B] px-3 py-2 font-inter text-[20px] leading-[25px] outline-none w-full min-h-[120px] resize-none mb-[50px]'
        />
      </div>

      {/* Study Preferences and Group Size Section */}
      <div className='relative flex w-full max-w-[770px] gap-4'>
        {/* Study preferences buttons */}
        <div className='w-2/5'>
          <p className='font-inter font-semibold text-[20px] leading-[25px] mb-3 text-[#002855]'>
            Study Preferences
          </p>
          <div className='flex flex-wrap gap-3'>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-max px-5 py-0.5 rounded-[20px] border font-inter font-semibold text-[20px] leading-[25px]
                  ${
                    selected === option
                      ? 'bg-[#FFD100] border-[#6B819B]'
                      : 'border-[#6B819B] text-[#002855] bg-transparent'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer for layout */}
        <div className='w-1/5'></div>

        {/* Preferred group size buttons */}
        <div className='w-2/5'>
          <p className='font-inter font-semibold text-[20px] leading-[25px] mb-3 text-[#002855]'>
            Preferred Group Size
          </p>
          <div className='flex flex-wrap gap-3'>
            {groupSizes.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedSize(value)}
                className={`w-max px-3 py-0.5 rounded-[20px] border font-inter font-semibold text-[20px] leading-[25px]
                  ${
                    selectedSize === value
                      ? 'bg-[#FFD100] border-[#6B819B]'
                      : 'border-[#6B819B] text-[#002855] bg-transparent'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects I'm Studying Section */}
      <div className='relative w-full max-w-[770px] mt-[30px]'>
        <p className='font-inter font-semibold text-[20px] leading-[25px] mb-3 text-[#002855]'>
          Subjects I'm Studying
        </p>
        {/* Display list of added subjects */}
        <div className='flex flex-wrap gap-x-3'>
          {subjects.map((subject, index) => (
            <div
              key={index}
              className='w-max px-4 py-0.5 rounded-[20px] border bg-[#002855] flex items-center justify-center mb-2'
            >
              <div className='font-inter font-semibold text-[20px] leading-[25px] text-white flex items-center justify-center'>
                {subject}
              </div>
              {/* Delete button for each subject */}
              <button
                onClick={() => handleDeleteClick(index)}
                className='ml-2 text-white font-inter text-[30px] leading-[25px] hover:text-[#DD0000] focus:outline-none'
                aria-label={`Delete ${subject}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {/* Input and button for adding new subjects */}
        <div className='relative w-full'>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddClick();
              }
            }}
            className='w-full h-[50px] border border-[#6B819B] rounded-[5px] px-3 font-inter text-[20px] leading-[25px] outline-none pr-[85px]'
          />
            <button
            onClick={handleAddClick}
            className='absolute top-1/2 right-0 w-[50px] h-[50px] bg-[#002855] rounded-r-[5px] flex items-center justify-center text-white font-inter text-[32px] hover:bg-[#004080] focus:outline-none -translate-y-1/2'
            aria-label='Add subject'
            >
            <span className='flex items-center justify-center w-full h-full'>
              +
            </span>
            </button>
        </div>
      </div>

      {/* Save and Skip Buttons Section */}
      <div className='relative w-full max-w-[770px] mt-[60px] flex justify-end gap-2'>
        {/* Skip button to discard or save blank data */}
        <button
          onClick={handleSkip}
          className='text-[#002855] border border-[#002855] px-6 py-3 rounded-[5px] hover:bg-gray-100 font-inter font-semibold text-[20px] leading-[20px]'
        >
          Cancel
        </button>
        {/* Save button to persist profile data */}
        <button
          onClick={handleSaveProfile}
          className='bg-[#002855] border border-[#002855] rounded-[5px] text-white px-6 py-3 hover:bg-[#004080] font-inter font-semibold text-[20px] leading-[20px]'
        >
          Save Profile
        </button>
      </div>

      {/* Spacer for bottom padding */}
      <div className='h-[18px]' />
    </div>
  );
}
