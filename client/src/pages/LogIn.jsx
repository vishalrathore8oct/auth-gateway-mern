import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { logInStart, logInSuccess, logInFailure } from "../redux/user/userSlice.js"
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth.jsx"

export default function LogIn() {

  const [formData, setformData] = useState({})

  const { loading, error } = useSelector( (state) => state.user)
  console.log(loading, error);
  
  const navigate = useNavigate();
  const dispatch = useDispatch() 

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      dispatch(logInStart())
      const res = await fetch("/api/auth/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(logInFailure(data))
        return
      }

      dispatch(logInSuccess(data))

      navigate("/")

    } catch (err) {
      dispatch(logInFailure(err))
      
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Log In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" placeholder="email" className="bg-slate-200 p-3 rounded-lg" onChange={handleChange} />
        <input type="password" name="password" id="password" placeholder="password" className="bg-slate-200 p-3 rounded-lg" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          {loading ? "Loading....": "Log In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-3 mt-5">
        <p>Do not Hava an Account ?</p>
        <Link to="/sign-in"><span className="text-blue-500">Sign In</span></Link>
      </div>
      <p className="text-red-700">{error ? error.message || "Something Went Wrong!": ""}</p>
    </div>
  )
}
