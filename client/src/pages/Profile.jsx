import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { userUpdateStart, userUpdateSuccess, userUpdateFailure, userDeleteStart, userDeleteSuccess, userDeleteFailure, logOut } from "../redux/user/userSlice.js";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [formData, setFormData] = useState({})
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  }, [image])

  const handleFileUpload = async (image) => {
    setUploading(true)
    setProgress(0)
    setUploadError("");

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
      setUploadError("Failed to upload image. Please try again.");
    }

    setUploading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      dispatch(userUpdateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(userUpdateFailure(data))
        return
      }

      dispatch(userUpdateSuccess(data))
      setUpdateSuccess(true)

    } catch (err) {
      dispatch(userUpdateFailure(err))
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(userDeleteStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(userDeleteFailure(data))
        return
      }

      dispatch(userDeleteSuccess(data))

    } catch (err) {
      dispatch(userDeleteFailure(err))
    }
  }

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/log-out")
      dispatch(logOut())
    } catch (error) {
      console.log(error);
      
    }
  }

  // console.log(formData);


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <img src={formData.profilePicture || currentUser.profilePicture} alt="profilePicture" className="h-32 w-32 self-center cursor-pointer rounded-full object-cover mt-2" onClick={() => fileRef.current.click()} />
        {uploading ? (
          <p className="text-center font-bold text-xl text-gray-500">
            Uploading... {progress}%
          </p>
        ) : uploadError ? (
          <p className="text-center font-bold text-xl text-red-500">{uploadError}</p>
        ) : formData.profilePicture ? (
          <p className="text-center font-bold text-xl text-green-500">
            Uploaded Successfully
          </p>
        ) : null}

        <input type="text" name="username" id="username" placeholder="username" className="bg-slate-200 p-3 rounded-lg" defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" name="email" id="email" placeholder="email" className="bg-slate-200 p-3 rounded-lg" defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" name="password" id="password" placeholder="password" className="bg-slate-200 p-3 rounded-lg" onChange={handleChange} />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 font-semibold cursor-pointer hover:underline bg-white rounded-lg shadow-md p-4">
          Delete Account
        </span>
        <span onClick={handleLogOut} className="text-red-700 font-semibold cursor-pointer hover:underline bg-white rounded-lg shadow-md p-4">
          Log Out
        </span>
      </div>
      <p className="text-red-500 mt-5">{error ? error.message || "Something Went Wrong!": ""}</p>
      <p className="text-green-500 mt-5 text-center">{updateSuccess && "User is Updated Successfully !"}</p>
    </div>

  )
} 