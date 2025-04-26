import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom'
import { BsRecord2 } from "react-icons/bs";
import MoviesDDN from './moviesddn';
import UserDDN from './userddn';


function Navbar() {
    const [username, setUsername] = useState("abijanu101");

    useEffect(() => {
        // fetch username



    }, []);


    return (
        <>

            <header className="w-full bg-gradient-to-r  from-teal-700 to-green-600/85 text-white text-center font-thin p-2">
                <div className="flex gap-5 text-xl">
                    <Link className="flex gap-2" to="/home/">
                        <BsRecord2 className="mt-0.5 text-2xl" />
                        <div className="w-0.5 bg-white/70"></div>
                    </Link>
                    <div className='flex-1 flex gap-8'>


                        <div className='flex gap-2 '>
                            <Link className="text-white/85 hover:text-white/100" to="/m/">Movies</Link>
                            <div className="flex-1/2 w-full">
                             
                                <MoviesDDN />
                            </div>
                        </div>
                        <Link to="/p/" className="text-white/85 hover:text-white/100">Celebrities</Link>
                    </div>
                    {username ?
                        <div className="flex gap-5">
                            <p>{username}</p>
                            <UserDDN />
                        </div>
                        :
                        <div className="flex gap-5">
                            <Link to="/login" className="text-white/85 hover:text-white/100"> Login </Link>
                            <Link to="/signup" className="text-white/85 hover:text-white/100">Signup</Link>
                        </div>
                    }
                </div>
            </header>

            <Outlet />
        </>
    )

}


export default Navbar;