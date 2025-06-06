import ProfileForm from './profileForm/profileForm';

/*
  Entire profile for Create/Edit Profile in Figma (with image, upload, & buttons) 
  className="min-h-screen flex items-center justify-center bg-gray-100"
*/

function MainPage() {
  return (
    <div>
      <Header />
      <NameSection />

    </div>
  );
}

function Header() {
  return (
    <div className="relative h-[318px] w-[100vw]">
      <div className="absolute top-[72px] w-[100vw] h-[154px] bg-[#002855]"></div> 

      <div className="absolute w-[169px] h-[41px] top-[15px] left-[12px]">
        <img src="logo.svg"
        alt="logo" className="w-full h-full object-cover" />
      </div>

      <div className="absolute w-[250px] h-[54px] top-[122px] right-[222px] rounded-[10px] border-2 border-[#F5F5F5] bg-white">
        <div className="absolute w-[230px] h-[32px] top-[10px] left-[10px]">
          <img src="BacktoDashboard.svg" alt="editprofile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute w-[170px] h-[54px] top-[122px] right-[28px] rounded-[10px] border-2 border-white">
        <div className="absolute w-[149px] h-[32px] top-[10px] left-[10px]">
          <img src="EditProfile.svg" alt="editprofile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute top-[146px] left-[61px] w-[172px] h-[172px] rounded-full border-[5px] border-white overflow-hidden">
        <img src="https://teachmeanatomy.info/wp-content/uploads/Head-Cover-Photo.png"
        alt="head" className="w-full h-full object-cover" />
      </div>


    </div>
  );
}

function NameSection() {
  return (
    <div>

    </div>
  );
}





export default function Profile() {
  return (
    <div>
      <MainPage />
    </div>
  );
}
