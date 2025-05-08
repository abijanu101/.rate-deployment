import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { starsFromNumber } from "../../helpers/starsFromNumber";

function Movies() {
    const [movies, setMovies] = useState();

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKENDURL + '/movies/', { method: 'GET' })
            .then(res => res.json())
            .then(res => {
                res.sort((a, b) => b.meanRating - a.meanRating);
                setMovies(res);
            })
            .catch(err => console.error(err));
    }, []);


    return (
        <div className="mt-5 flex gap-5 flex-wrap justify-center">

            {movies && movies.map((i, index) =>
                <Link
                    to={'/m/' + i.id}
                    className="w-md p-5 border-4 hover:bg-teal-700 hover:from-teal-800 brightness-95 hover:brightness-100 hover:to-green-700/50 hover:text-white text-green-800 hover:shadow-lg shadow-teal-900/50 transition-all duration-300 from-teal-100 to-green-50 bg-conic-150 border-green-800/30 hover:border-green-800/100 cursor-pointer  flex gap-8"
                    key={index}
                >
                    <img
                        className="w-44 h-66 shadow-md shadow-green-900"
                        src={URL.createObjectURL(new Blob([new Uint8Array(i.imageBin.data)], { type: i.imageMIME }))}
                    />
                    <div className="flex-1">
                        <div className="flex flex-col gap-1">
                            <h2 className="block text-2xl font-semibold overflow-ellipsis border-b border-green-800">{i.title}</h2>
                            <div className="w-full overflow-ellipsis text-xl text-amber-500 flex">
                                {starsFromNumber( Math.round(i.meanRating), index)}
                                <p>&nbsp;</p>
                                <p className="-mt-1 text-lg">{Math.round(100 * i.meanRating) / 100}</p>
                            </div>
                            <div>Lorem ipsum dolor sit amet </div>
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
}

export default Movies;