import { Link } from "react-router-dom"

export default function SignIn() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4">
        <input type="text" name="username" id="username" placeholder="username" className="bg-slate-200 p-3 rounded-lg" />
        <input type="email" name="email" id="email" placeholder="email" className="bg-slate-200 p-3 rounded-lg" />
        <input type="password" name="password" id="password" placeholder="password" className="bg-slate-200 p-3 rounded-lg" />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">Sign In</button>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Hava an Account ?</p>
        <Link to="/log-in"><span className="text-blue-500">Log In</span></Link>
      </div>
    </div>
  )
}
