import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from "react";
import { BsTriangle, BsTriangleFill } from 'react-icons/bs';
import { HiDotsVertical } from 'react-icons/hi';

function UserDDN() {
    const [isOpen, setIsOpen] = useState(false);
    const ddnRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ddnRef.current && !ddnRef.current.contains(event.target))
                setIsOpen(false);
        }
        
        if (ddnRef.current) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);


    return (
        <>
            {!isOpen && <HiDotsVertical className="text-white/85 hover:text-white/100 cursor-pointer mt-1" onClick={() => setIsOpen(true)} />}
            {isOpen && <>
                <BsTriangleFill className="text-white/85 hover:text-white/100 cursor-pointer rotate-180 text-sm mt-2.5" />
                <div ref={ddnRef} className="text-left w-30 absolute top-13 right-2 backdrop-blur-sm rounded-md bg-gradient-to-r from-teal-50/95 to-green-50/70 text-green-700 border-2 border-green-700/80 shadow-md shadow-teal-700/20">
                    <ul className="w-full">
                        <div className="flex-col">
                            <Link className="block hover:bg-gradient-to-r hover:from-green-600/95 hover:to-green-500/85 hover:text-white w-full p-1 px-3" to={"/profile/"} onClick={() => setIsOpen(false)} >
                                Profile
                            </Link>
                            <Link className="block hover:bg-gradient-to-r hover:from-green-600/95 hover:to-green-500/85 hover:text-white w-full p-1 px-3" to={"/settings/"} onClick={() => setIsOpen(false)} >
                                Settings
                            </Link>
                        </div>
                        <div className="border-t border-t-green-700/50">
                            <Link className="block hover:bg-gradient-to-r hover:from-green-600/95 hover:to-green-500/85 hover:text-white w-full p-1 px-3" to={"/login/"} onClick={() => setIsOpen(false)} >
                                Logout
                            </Link>
                        </div>
                    </ul>
                </div>
            </>}
        </>
    )

}

export default UserDDN;