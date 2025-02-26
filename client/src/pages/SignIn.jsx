import { Link } from "react-router-dom"
import { useState } from "react"

export default function SignIn() {

  const [formData, setformData] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value })
  }
  // console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(false)
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      console.log(data);

      setLoading(false)

      if (data.success === false) {
        setError(true)
        return
      }

    } catch (error) {
      setLoading(false)
      setError(true)
      
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder="username" className="bg-slate-200 p-3 rounded-lg" onChange={handleChange} />
        <input type="email" name="email" id="email" placeholder="email" className="bg-slate-200 p-3 rounded-lg" onChange={handleChange} />
        <input type="password" name="password" id="password" placeholder="password" className="bg-slate-200 p-3 rounded-lg" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          {loading ? "Loading....": "Sign In"}
        </button>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Hava an Account ?</p>
        <Link to="/log-in"><span className="text-blue-500">Log In</span></Link>
      </div>
      <p className="text-red-700">{error && "Something Went Wrong!"}</p>
    </div>
  )
}
