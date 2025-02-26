import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div>
            <div className="bg-slate-300">
                <div className="flex justify-between items-center mx-auto px-32 py-5">
                    <Link to="/"><h1 className="font-bold">Auth App</h1></Link>
                    <ul className="flex gap-16">
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/log-in"><li>Log In</li></Link>
                        <Link to="/sign-in"><li>Sign In</li></Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
