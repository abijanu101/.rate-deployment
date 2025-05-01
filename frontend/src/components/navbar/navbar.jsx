import { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom'
import { BsRecord2 } from "react-icons/bs";
import MoviesDDN from './moviesddn';
import UserDDN from './userddn';
import { AuthContext } from '../../contexts/index';


function Navbar() {
    const {user, token, updateUserInfo} = useContext(AuthContext);
    useEffect(()=>{updateUserInfo()},[token]);

    return (
        <header className="w-full bg-gradient-to-r h-12 from-teal-700 to-green-600/85 text-white text-center font-thin p-2 z-50">
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
                {user ?
                    <div className="flex gap-5">
                        <p>{user.username}</p>
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
    )

}


export default Navbar;