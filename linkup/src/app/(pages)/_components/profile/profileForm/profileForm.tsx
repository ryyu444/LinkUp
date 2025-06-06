/*
    Form for Create/Edit Profile in Figma
*/
interface ProfileFormProps {
  onClose: () => void;
}

export default function ProfileForm({ onClose }: ProfileFormProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black text-xl font-bold hover:text-red-500"
      >
        ✕
      </button>

      {/* Your Form Content */}
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
      {/* ...其他表单字段... */}
    </div>
  );
}