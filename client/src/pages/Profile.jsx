import { useSelector } from "react-redux"


export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5">
        <img src={currentUser.profilePicture} alt="profilePicture" className="h-32 w-32 self-center cursor-pointer rounded-full object-cover mt-2" />
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