import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from "react";
import { BsTriangle, BsTriangleFill } from 'react-icons/bs';

function MoviesDDN() {
    const [genres, setGenres] = useState([
        { id: "0", name: "Action" },
        { id: "1", name: "Sci-Fi" },
        { id: "2", name: "Thriller" },
        { id: "3", name: "Horror" },
        { id: "4", name: "Slice of Life" }
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const ddnRef = useRef();

    useEffect(() => {
        //fetch all genre names

        const handleClickOutside = (event) => {
            if (ddnRef && !ddnRef.current.contains(event.target))
                setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <>
            {!isOpen && <BsTriangle className="text-white/85 hover:text-white/100 cursor-pointer rotate-180 text-sm mt-2.5" onClick={() => setIsOpen(true)} />}
            {isOpen && <>
                <BsTriangleFill className="text-white/85 hover:text-white/100 cursor-pointer rotate-180 text-sm mt-2.5" />
                <div ref={ddnRef} className="text-left w-50 absolute top-13 left-20 backdrop-blur-sm rounded-md bg-gradient-to-r from-teal-50/65 to-green-50/30 text-green-700 border-2 border-green-700/80 shadow-md shadow-teal-700/20">
                    <ul className="w-full">
                        <div className="flex-col">
                            {genres.map((i, index) => {
                                return (
                                    <li key={index} className='w-full'>
                                        <Link className="block hover:bg-gradient-to-r hover:from-teal-700/85 hover:to-green-600/85 hover:text-white w-full p-1 px-3" to={"/g/" + i.id} onClick={() => setIsOpen(false)} >
                                            {i.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </div>
                        <div className="border-t border-t-green-700/50">
                            <Link className="block hover:bg-gradient-to-r hover:from-teal-700/85 hover:to-green-600/85 hover:text-white w-full p-1 px-3" to={"/m/create"} onClick={() => setIsOpen(false)} >
                                Add Movie
                            </Link>
                        </div>
                    </ul>
                </div>
            </>}
        </>
    )

}

export default MoviesDDN;