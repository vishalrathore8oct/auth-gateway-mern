import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("");

  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])

  const handleFileUpload = async (image) => {
    setLoading(true)
    setProgress(0)
    setError("");

    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "auth-gateway-profile-images")
    data.append("cloud_name", "dqee7nzhx")

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dqee7nzhx/image/upload", data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setFormData({ ...formData, profilePicture: res.data.url });

    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    }

    setLoading(false)
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <img src={formData.profilePicture || currentUser.profilePicture} alt="profilePicture" className="h-32 w-32 self-center cursor-pointer rounded-full object-cover mt-2" onClick={() => fileRef.current.click()} />
        {loading ? (
          <p className="text-center font-bold text-xl text-gray-500">
            Uploading... {progress}%
          </p>
        ) : error ? (
          <p className="text-center font-bold text-xl text-red-500">{error}</p>
        ) : formData.profilePicture ? (
          <p className="text-center font-bold text-xl text-green-500">
            Uploaded Successfully
          </p>
        ) : null}

        <input type="text" name="username" id="username" placeholder="username" className="bg-slate-200 p-3 rounded-lg" defaultValue={currentUser.username} />
        <input type="email" name="email" id="email" placeholder="email" className="bg-slate-200 p-3 rounded-lg" defaultValue={currentUser.email} />
        <input type="password" name="password" id="password" placeholder="password" className="bg-slate-200 p-3 rounded-lg" />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 font-semibold cursor-pointer hover:underline bg-white rounded-lg shadow-md p-4">
          Delete Account
        </span>
        <span className="text-red-700 font-semibold cursor-pointer hover:underline bg-white rounded-lg shadow-md p-4">
          Log Out
        </span>
      </div>
    </div>

  )
}