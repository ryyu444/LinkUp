import { useState } from "react";

/*
    Form for Create/Edit Profile in Figma
*/
interface ProfileFormProps {
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

function MainPage() {
  return (
    <div className="relative flex w-full h-full">
      <Leftside />
      <Rightside />
    </div>
  );
}



function Leftside() {
  return (
    <div className="w-[30vw] h-full bg-[#F0F0F0]">

    </div>
  );
}

function Rightside() {
  const [selectedYear, setSelectedYear] = useState("");
  const years = ["1st year", "2nd year", "3rd year", "4th year"];

  const [selected, setSelected] = useState<string>("");
  const options = ["Quiet", "Some Noise", "Collaborative"];

  const [selectedSize, setSelectedSize] = useState<string>("");
  const groupSizes = ["1 on 1", "Small (2-4)", "Large (5+)"];

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
          outline-none w-full min-h-[120px] resize-none mb-[45px]"
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
          <p className="font-inter font-semibold text-[20px] leading-[25px] tracking-[0px] align-middle text-[#002855]">
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

      <div className="relative w-[55vw] bg-[#ffffee] mt-[45px]">sadasd</div>


    </div>
  );
}




export default function ProfileForm({ onClose }: ProfileFormProps) {
  return (
    <div className="absolute w-full h-full top-[0] left-[0]">
      
      <Logo />
      <Header />
      <MainPage />
      
      
    </div>
  );
}