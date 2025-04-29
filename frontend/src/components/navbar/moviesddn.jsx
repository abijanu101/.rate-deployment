import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from "react";
import { BsTriangle, BsTriangleFill } from 'react-icons/bs';

function MoviesDDN() {
    const [genres, setGenres] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const ddnRef = useRef();

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKENDURL + '/genres/', { method: "GET" })
            .then(res => res.json())
            .then(res => setGenres(res))
            .catch(err => console.error(err));

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
            {!isOpen && <BsTriangle className="text-white/85 hover:text-white/100 cursor-pointer rotate-180 text-sm mt-2.5" onClick={() => setIsOpen(true)} />}
            {isOpen && <>
                <BsTriangleFill className="text-white/85 hover:text-white/100 cursor-pointer rotate-180 text-sm mt-2.5" />
                <div ref={ddnRef} className="text-left w-50 absolute top-13 left-20 backdrop-blur-sm rounded-md bg-gradient-to-r from-teal-50/95 to-green-50/70 text-green-700 border-2 border-green-700/80 shadow-md shadow-teal-700/20">
                    <ul className="w-full">
                        <div className="flex-col">
                            {genres.map((i, index) => {
                                return (
                                    <li key={index} className='w-full'>
                                        <Link className="transition-colors duration-200 block hover:bg-gradient-to-r hover:from-teal-700/85 hover:to-green-600/85 hover:text-white w-full p-1 px-3" to={"/g/" + i.id} onClick={() => setIsOpen(false)} >
                                            {i.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </div>
                        <div className="border-t border-t-green-700/50">
                            <Link className="transition-colors duration-400 block hover:bg-gradient-to-r hover:from-amber-700/85 hover:to-yellow-500/85 hover:shadow-amber-500 hover:text-white w-full p-1 px-3" to={"/m/create"} onClick={() => setIsOpen(false)} >
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