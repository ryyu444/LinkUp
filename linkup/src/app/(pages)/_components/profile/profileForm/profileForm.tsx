import { useRef, useState } from "react";

/*
    Form for Create/Edit Profile in Figma
*/
interface ProfileFormProps {
  onClose: () => void;
}

interface MainPageProps {
  onClose: () => void;
}


function Logo() {
  return (
    <div className="relative w-[100vw] h-[72px]">
      <div className="relative w-[169px] h-[41px] top-[15px] left-[12px] z-10">
        <img src="logo.svg" alt="logo" className="w-full h-full object-cover" />
      </div>
    </div>
    
  );
}

function Header() {
  return (
    <div className="relative w-[100vw] h-[100px]">
      <p className="font-inter font-semibold text-[60px] leading-[50px] tracking-[0px] mb-4 text-[#002855] text-center align-middle">
        Edit Your Profile
      </p>
      <p className="font-inter font-semibold text-[20px] leading-[20px] tracking-[0px] text-center align-middle">
        Tell us about yourself so others can find you for study sessions
      </p>
    </div>
  );
}

function MainPage({ onClose }: MainPageProps) {
  return (
    <div className="relative flex w-full h-full">
      <Leftside />
      <Rightside onClose={onClose} />
    </div>
  );
}



function Leftside() {
  const [profileImage, setProfileImage] = useState(
    "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-[30vw] h-full flex flex-col items-end p-4">
      <div className="w-[22vw] h-[22vw] rounded-full overflow-hidden 
      border-[1px] border-[#002855] mb-4">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <button
        onClick={handleUploadClick}
        className="w-[22vw] h-[69px] rounded-[5px] bg-[#F5F5F5] text-[#002855] 
        font-inter font-semibold text-[20px] leading-[25px]
        flex items-center justify-center gap-3 hover:bg-gray-200"
      >
        <img
          src="ImageUpload.svg"
          alt="Upload"
          className="w-[37px] h-[37px]"
        />
        Upload Image
      </button>
    </div>
  );
}


function Rightside({ onClose }: ProfileFormProps) {
  const [selectedYear, setSelectedYear] = useState("");
  const years = ["1st year", "2nd year", "3rd year", "4th year"];
  {/* Button for choosing study preference */}
  const [selected, setSelected] = useState<string>("");
  const options = ["Quiet", "Some Noise", "Collaborative"];
  {/* Button for group sizing */}
  const [selectedSize, setSelectedSize] = useState<string>("");
  const groupSizes = ["1 on 1", "Small (2-4)", "Large (5+)"];
  {/* Button for adding and deleting subject */}
  const [inputValue, setInputValue] = useState("");
  const [subjects, setSubjects] = useState<string[]>([])
  const handleAddClick = () => {
    if (inputValue.trim()) { // Only add non-empty values
      setSubjects([...subjects, inputValue]); // Add to subjects list
      setInputValue(""); // Clear input
    }
  };
  const handleDeleteClick = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index)); // Remove subject at index
  };

  return (
    <div className="w-[70vw] h-full ml-4">
      {/* Full name text input */}
      <div className="relative w-[55vw]">
        <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle text-[#002855]">
          Full Name
        </p>
        <input
          type="text"
          placeholder="Enter Your Name"
          className="rounded-[5px] border border-[#6B819B] px-3 py-2
            font-inter font-normal text-[24px] leading-[50px] tracking-[0px] align-middle
            outline-none mb-3 w-full"
        />
      </div>

      {/* flex container for Major and Year */}
      <div className="relative flex w-[55vw]">
        {/* Major block */}
        <div className="w-3/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle text-[#002855]">
            Major
          </p>
          <input
          type="text"
          placeholder="Enter Your Major"
          className="rounded-[5px] border border-[#6B819B] px-3 py-2
            font-inter font-normal text-[24px] leading-[50px] tracking-[0px] align-middle
            outline-none mb-3 w-9/10"
          />
        </div>

        {/* Year block */}
        <div className="w-2/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle text-[#002855]">
            Year
          </p>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-[346px] h-[69px] border border-[#6B819B] rounded-[5px]
                font-inter font-medium text-[24px] leading-[50px] tracking-[0px]
                text-[#000] px-4 align-middle outline-none w-full"
            >
              <option value="" disabled>
                Select Your Year
              </option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Biography block */}
      <div className="relative w-[55vw]">
        <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle text-[#002855]">
          About Yourself
        </p>
        <textarea
          placeholder="Enter Your Biography Here"
          className="rounded-[5px] border border-[#6B819B] px-3 py-2
          font-inter font-normal text-[20px] leading-[25px]
          outline-none w-full min-h-[120px] resize-none mb-[60px]"
        />
      </div>


      {/* Preference block */}
      <div className="relative flex w-[55vw]">
        {/* Study preference block */}
        <div className="w-2/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] mb-2 align-middle text-[#002855]">
            Study Preferences
          </p>

          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`w-max px-5 py-0.5 rounded-[20px] border text-center font-inter font-semibold text-[20px] leading-[25px]
                ${
                  selected === option
                    ? "bg-[#FFD100] border-[#6B819B]"
                    : "border-[#6B819B] text-[#002855] bg-transparent"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-1/5"></div>

        {/* Group size block */}
        <div className="w-2/5">
          <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle mb-2 text-[#002855]">
            Preferred Group Size
          </p>
          <div className="flex flex-wrap gap-2">
            {groupSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-max px-3 py-0.5 rounded-[20px] border text-center font-inter font-semibold text-[20px] leading-[25px]
                  ${
                    selectedSize === size
                      ? "bg-[#FFD100] border-[#6B819B]"
                      : "border-[#6B819B] text-[#002855] bg-transparent"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-[55vw] mt-[30px]">
        <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle mb-2 text-[#002855]">
          Subjects I'm Studying
        </p>

        <div className="flex flex-wrap gap-2 ">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="w-max px-4 py-0.5 rounded-[20px] border bg-[#002855] flex items-center mb-2"
            >
              <div className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] text-center align-middle text-[#FFFFFF]">
                {subject}
              </div>
              <button
                onClick={() => handleDeleteClick(index)}
                className="ml-2 text-[#FFFFFF] font-inter text-[30px] leading-[25px] 
                tracking-[0px] hover:text-[#DD0000] focus:outline-none"
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
            placeholder="Enter Here"
            value={inputValue} // Bind to state
            onChange={(e) => setInputValue(e.target.value)} // Update state on change
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddClick();
              }
            }}
            className="w-full h-[50px] border border-[#6B819B] rounded-[5px] px-3
                   font-inter text-[20px] leading-[25px] outline-none pr-[85px]" // Add padding-right for button
          />
          <button
            onClick={handleAddClick}
            className="absolute top-0 right-0 w-[75px] h-[50px] bg-[#002855] rounded-r-[5px] 
                   flex items-center justify-center text-white font-inter text-[50px] z-10
                   hover:bg-[#004080] focus:outline-none" // Add hover and focus styles
            aria-label="Add subject" // For accessibility
          >
            +
          </button>
        </div>
      </div>

      <div className="relative w-[55vw] mt-[60px] flex justify-end gap-2">
        <button 
        onClick={onClose}
        className="text-[#002855] border border-[#002855] px-6 py-3 rounded-[5px] 
        hover:bg-gray-100
        font-inter font-semibold text-[20px] leading-[20px] tracking-[0px] align-middle text-[#002855]
        ">
          Skip for Now
        </button>
        <button 
        onClick={onClose}
        className="bg-[#002855] border border-[#002855] rounded-[5px] text-white px-6 py-3 rounded hover:bg-[#004080]
        font-inter font-semibold text-[20px] leading-[20px] tracking-[0px] align-middle">
          Save Profile
        </button>
      </div>

    </div>
  );
}




export default function ProfileForm({ onClose }: ProfileFormProps) {
  return (
    <div className="absolute w-full h-full top-[0] left-[0]">
      
      <Logo />
      <Header />
      <MainPage onClose={onClose} />
      
      
    </div>
  );
}