import { useState, useEffect } from "react";
import { getFirebaseAuth, getFirebaseDB } from "@/(api)/_lib/firebase/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ProfileFormProps {
  onClose: () => void;
}

interface MainPageProps {
  onClose: () => void;
  className?: string;
  profileImage: string;
  setProfileImage: React.Dispatch<React.SetStateAction<string>>;
}

function ProfileForm({ onClose }: ProfileFormProps) {
  const [profileImage, setProfileImage] = useState(
    "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
  );

  return (
    <div className="relative w-full h-full top-0 left-0 bg-white flex flex-col items-center">
      <div className="relative w-full max-w-[1440px] h-full px-4">
        <Header />
        <MainPage onClose={onClose} profileImage={profileImage} setProfileImage={setProfileImage} />
      </div>
    </div>
  );
}

export default ProfileForm;

function Header() {
  return (
    <div className="mt-[72px] w-full h-[100px] flex flex-col items-center justify-center">
      <p className="font-inter font-semibold text-[60px] leading-[50px] mb-4 text-[#002855] text-center align-middle">
        Edit Your Profile
      </p>
      <p className="font-inter font-semibold text-[20px] leading-[20px] text-center align-middle text-[#002855]">
        Tell us about yourself so others can find your session
      </p>
    </div>
  );
}

function MainPage({ onClose, profileImage, setProfileImage, className }: MainPageProps) {
  return (
    <div className={`relative flex w-full h-full max-w-[1330px] mx-auto px-4 pt-[20px] ${className || ""}`} style={{ paddingTop: "20px" }}>
      <Leftside profileImage={profileImage} setProfileImage={setProfileImage} className="w-[30%]" />
      <Rightside onClose={onClose} profileImage={profileImage} setProfileImage={setProfileImage} className="w-[70%] ml-4" />
    </div>
  );
}

function Leftside({ profileImage, setProfileImage, className }: { profileImage: string, setProfileImage: React.Dispatch<React.SetStateAction<string>>, className?: string }) {
  // This function will prompt the user to enter an image URL
  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent any default refresh behavior
    const url = prompt("Enter the image URL (Warning: This will refresh your form, so save other changes prior to upload!):");

    if (url) {
      // Check if the URL is a valid image URL
      const img = new Image();
      img.onload = () => {
        setProfileImage(url); // Update the profileImage state which triggers a re-render of the image
        saveProfileImageToDatabase(url); // Optionally save the new image URL to Firestore
      };
      img.onerror = () => alert("Invalid URL. Please try again with a valid image URL.");
      img.src = url;
    }
  };


  // Save the profile image to Firestore
  const saveProfileImageToDatabase = async (url: string) => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDB();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("No authenticated user found.");
      return;
    }

    const profileData = {
      profileImageUrl: url, // Save the new profile image URL here
    };

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, profileData, { merge: true }); // Update Firestore with new profile image
    } catch (error) {
      console.error("Error saving profile image:", error);
      alert("Failed to save profile image.");
    }
  };

  return (
    <div className={`${className} h-full flex flex-col items-end p-4`}>
      <div className="w-full max-w-[360px] aspect-square rounded-full overflow-hidden border-[1px] border-[#002855] mb-4">
        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
      </div>

      <button
        onClick={handleUploadClick}
        className="w-full max-w-[360px] h-[60px] rounded-[5px] bg-[#F5F5F5] text-[#002855] 
        font-inter font-semibold text-[20px] leading-[25px]
        flex items-center justify-center gap-3 hover:bg-gray-200"
      >
        <img src="ImageUpload.svg" alt="Upload" className="w-[37px] h-[37px]" />
        Upload Image
      </button>
    </div>
  );
}


function Rightside({ onClose, profileImage, setProfileImage, className }: ProfileFormProps & { className?: string, profileImage: string, setProfileImage: React.Dispatch<React.SetStateAction<string>> }) {
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]); // subjects array to store user's subjects
  const [profileSaved, setProfileSaved] = useState(false); // Track whether profile is saved or not

  const years = ["1st year", "2nd year", "3rd year", "4th year"];
  const options = ["Quiet", "Some Noise", "Collaborative"];
  const groupSizes = ["1 on 1", "Small (2-4)", "Large (5+)"];

  // Fetch user profile data from Firebase when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const auth = getFirebaseAuth();
      const db = getFirebaseDB();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setMajor(userData.major || "");
          setSelectedYear(userData.year || "");
          setBio(userData.biography || "");
          setSubjects(userData.subjects || []);
          setSelected(userData.studyPreference || "");
          setSelectedSize(userData.groupSize || "");
          setProfileImage(userData.profileImageUrl || profileImage);
          setProfileSaved(userData.profileSaved || false); // Check profileSaved flag
        }
      }
    };

    fetchProfileData();
  }, [profileImage]);

  const handleAddClick = () => {
    if (inputValue.trim()) {
      setSubjects([...subjects, inputValue]);
      setInputValue("");  // Clear input field after adding subject
    }
  };

  const handleDeleteClick = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));  // Delete subject at the specified index
  };

  // Save profile data to Firestore
  const handleSaveProfile = async () => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDB();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("No authenticated user found.");
      return;
    }

    const profileData = {
      name,
      major,
      year: selectedYear,
      biography: bio,
      studyPreference: selected,
      groupSize: selectedSize,
      subjects,  // Include subjects
      email: currentUser.email,
      profileImageUrl: profileImage,  // Save the image URL here
      profileSaved: true, // Set profileSaved as true when the profile is saved
    };

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, profileData, { merge: true });  // Save data with subjects
      alert("Profile saved successfully!");
      setProfileSaved(true);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    }
  };

  // Save blank user profile if "Skip for Now" is clicked
  const handleSkip = async () => {
    if (profileSaved) {
      // If the profile is already saved, discard changes
      alert("Any unsaved changes will be discarded.");
      onClose();
      return;
    }

    const auth = getFirebaseAuth();
    const db = getFirebaseDB();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("No authenticated user found.");
      return;
    }

    const profileData = {
      name: "",  // Empty name
      major: "",  // Empty major
      year: "",  // Empty year
      biography: "",  // Empty bio
      studyPreference: "",  // Empty study preference
      groupSize: "",  // Empty group size
      subjects: [], // Empty subjects
      email: currentUser.email,
      profileImageUrl: profileImage,  // Save the image URL here
      profileSaved: false, // Set profileSaved as false when skipping
    };

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, profileData, { merge: true });
      alert("Profile saved with blank data.");
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className={`${className} h-full`}>
      {/* Full Name Section */}
      <div className="relative w-full max-w-[770px]">
        <p className="font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-1">
          Full Name
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-[5px] border border-[#6B819B] px-3 py-2 font-inter text-[24px] leading-[50px] outline-none mb-3 w-full"
        />
      </div>

      {/* Major and Year */}
      <div className="relative flex w-full max-w-[770px] gap-4">
        <div className="w-3/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-1">
            Major
          </p>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="rounded-[5px] border border-[#6B819B] px-3 py-2 font-inter text-[24px] leading-[50px] outline-none mb-3 w-full"
          />
        </div>

        <div className="w-2/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-1">
            Year
          </p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-[69px] border border-[#6B819B] rounded-[5px] font-inter text-[24px] leading-[50px] px-4 outline-none"
          >
            <option value="" disabled>Select Year</option>
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Biography Section */}
      <div className="relative w-full max-w-[770px]">
        <p className="font-inter font-semibold text-[20px] leading-[25px] text-[#002855] mb-1">
          About Yourself
        </p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="rounded-[5px] border border-[#6B819B] px-3 py-2 font-inter text-[20px] leading-[25px] outline-none w-full min-h-[120px] resize-none mb-[60px]"
        />
      </div>

      {/* Study Preferences */}
      <div className="relative flex w-full max-w-[770px] gap-4">
        <div className="w-2/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] mb-2 text-[#002855]">
            Study Preferences
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-max px-5 py-0.5 rounded-[20px] border font-inter font-semibold text-[20px] leading-[25px]
                  ${selected === option ? "bg-[#FFD100] border-[#6B819B]" : "border-[#6B819B] text-[#002855] bg-transparent"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="w-1/5"></div>

        <div className="w-2/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] mb-2 text-[#002855]">
            Preferred Group Size
          </p>
          <div className="flex flex-wrap gap-2">
            {groupSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-max px-3 py-0.5 rounded-[20px] border font-inter font-semibold text-[20px] leading-[25px]
                  ${selectedSize === size ? "bg-[#FFD100] border-[#6B819B]" : "border-[#6B819B] text-[#002855] bg-transparent"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects I'm Studying */}
      <div className="relative w-full max-w-[770px] mt-[30px]">
        <p className="font-inter font-semibold text-[20px] leading-[25px] mb-2 text-[#002855]">
          Subjects I'm Studying
        </p>
        <div className="flex flex-wrap gap-x-3">
          {subjects.map((subject, index) => (
            <div key={index} className="w-max px-4 py-0.5 rounded-[20px] border bg-[#002855] flex items-center mb-2">
              <div className="font-inter font-semibold text-[20px] leading-[25px] text-white text-center align-middle">
                {subject}
              </div>
              <button
                onClick={() => handleDeleteClick(index)}
                className="ml-2 text-white font-inter text-[30px] leading-[25px] hover:text-[#DD0000] focus:outline-none"
                aria-label={`Delete ${subject}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddClick();
              }
            }}
            className="w-full h-[50px] border border-[#6B819B] rounded-[5px] px-3 font-inter text-[20px] leading-[25px] outline-none pr-[85px]"
          />
          <button
            onClick={handleAddClick}
            className="absolute top-0 right-0 w-[75px] h-[50px] bg-[#002855] rounded-r-[5px] flex items-center justify-center text-white font-inter text-[50px] hover:bg-[#004080] focus:outline-none"
            aria-label="Add subject"
          >
            +
          </button>
        </div>
      </div>

      {/* Save Profile Button */}
      <div className="relative w-full max-w-[770px] mt-[60px] flex justify-end gap-2">
        <button
          onClick={handleSkip}
          className="text-[#002855] border border-[#002855] px-6 py-3 rounded-[5px] hover:bg-gray-100 font-inter font-semibold text-[20px] leading-[20px]"
        >
          Skip for Now
        </button>
        <button
          onClick={handleSaveProfile}
          className="bg-[#002855] border border-[#002855] rounded-[5px] text-white px-6 py-3 hover:bg-[#004080] font-inter font-semibold text-[20px] leading-[20px]"
        >
          Save Profile
        </button>
      </div>

      <div className="h-[18px]" />
    </div>
  );
}
