import { Link } from "react-router-dom";
import { useSelector } from "react-redux"

export default function Navbar() {
    const { currentUser } = useSelector((state) => state.user)
    return (
        <div>
            <div className="bg-slate-300">
                <div className="flex justify-between items-center mx-auto px-32 py-5">
                    <Link to="/"><h1 className="font-bold">Auth App</h1></Link>
                    <ul className="flex gap-16 items-center">
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/profile">
                        {currentUser ? (<img src={currentUser.profilePicture} alt="profilePicture" className="h-12 w-12 rounded-full object-cover" />) : (<li>Log In</li>)}
                        </Link>
                    </ul>
                </div>
                
            </div>
        </div>



    )
}
