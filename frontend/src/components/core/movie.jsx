import { useContext, useEffect, useRef, useState } from "react";
import { BsCameraReels, BsCameraReelsFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import ButtonFilled from "../commons/buttonFilled";
import { starsFromNumber } from "../../helpers/starsFromNumber";
import { BiEdit, BiTrash } from "react-icons/bi";
import ReviewForm from "./reviewform";
import NotFound from "../essentials/notfound";
import { AuthContext } from "../../contexts";

function Movie() {
    const navigate = useNavigate();
    const params = useParams(); // use params.movieID to send initial fetch request
    const { user } = useContext(AuthContext);

    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState([]);

    // Helpers

    function calculateAverageRating() {
        let sum = 0;
        for (const d of reviews)
            sum += d.rating;
        return sum / reviews.length;
    }
    function handleDelete() {
        fetch(import.meta.env.VITE_BACKENDURL + '/movies/' + params.movieID, { method: 'DELETE' })
            .then(() => navigate('/m/'))
            .catch((err) => console.err(err));
    }

    // Load Data
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKENDURL + '/movies/' + params.movieID, { method: 'GET' })
            .then(res => res.json())
            .then(res => {
                fetch(import.meta.env.VITE_BACKENDURL + '/genres/' + params.movieID, { method: 'GET' })
                    .then((res) => res.json())
                    .then((genresRes) => {
                        const buffer = new Uint8Array(res.imageBin.data);
                        const blob = new Blob([buffer], { type: res.imageMIME });
                        const url = URL.createObjectURL(blob);
                        setMovie({
                            title: res.title,
                            details: res.synopsis,
                            coverArt: url,
                            director: { id: res.director, fname: res.directorFname, lname: res.directorLname },
                            actors: res.actors,
                            genres: genresRes,
                            releaseDate: res.releasedOn.slice(0, 10)
                        });
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));


        fetch(import.meta.env.VITE_BACKENDURL + '/reviews/movies/' + params.movieID, { method: 'GET' })
            .then(res => res.json())
            .then(res => setReviews(() => res))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!reviews[0]) return;
        if (!user) {
            if (userReview)
                setReviews((prev) => [...prev, userReview]);
            setUserReview({});
        }
        else {
            setReviews((prev) => {
                let result = [];
                for (const r of prev) {
                    if (r.id === user.id)
                        setUserReview(r);
                    else
                        result.push(r);
                }
                return result;
            });
        }
    }, [user]);

    if (movie)
        return (
            <>
                <section className="w-full bg-gradient-to-br from-green-300/50 to-teal-200/25 py-10">
                    <div className="px-5 md:px-15 lg:px-25">
                        <div className="flex flex-row gap-10">
                            <div className="flex-1 shrink">
                                <div className="border-b-2 flex">
                                    <h1 className="text-5xl flex-1 p-5 border-green-800">{movie.title}</h1>
                                    {user && user.isAdmin && <>
                                        <span className="text-4xl mt-8 flex gap-2">
                                            <Link className="hover:rotate-0 rotate-5 transition-all duration-300 hover:text-green-800" to={"/m/edit/" + params.movieID}><BiEdit /></Link>
                                            <span className="hover:rotate-0 rotate-5 transition-all duration-300 hover:text-red-800 "><BiTrash onClick={handleDelete} /></span>

                                        </span>
                                    </>}
                                </div>
                                <div className="px-2 pt-4 flex flex-row gap-3">
                                    {reviews[0] && <div className="flex flex-row text-2xl text-green-700 gap-1">
                                        {starsFromNumber(Math.round(calculateAverageRating()), -1)}
                                    </div>}
                                    <p className="text-xl -mt-0.5">({reviews.length} reviews)</p>
                                </div>
                                <div className="p-3">
                                    <h2 className="text-2xl font-semibold text-teal-700">Synopsis:</h2>
                                    <p>{movie.details}</p>
                                    <div className="flex py-5 gap-5">
                                        <div className="w-70">
                                            <h2 className="text-2xl font-semibold text-teal-700">Genres:</h2>
                                            <ul className="flex flex-row gap-2">
                                                {movie.genres[0] ?
                                                    movie.genres.map((i, index) =>
                                                        <li key={index}><Link className="underline cursor-pointer" to={"/g/" + i.id}>
                                                            {i.gname}</Link>
                                                        </li>
                                                    ) : <li>
                                                        None Added
                                                    </li>
                                                }
                                            </ul>
                                            <h2 className="text-2xl font-semibold text-teal-700  mt-5">Actors:</h2>
                                            <ul>
                                                {movie.actors[0] ?
                                                    movie.actors.map((i, index) =>
                                                        <li key={index}>-&gt;&nbsp;
                                                            <Link className="underline cursor-pointer" to={"/p/" + i.id}>
                                                                {i.fname} {i.lname}</Link> as {i.appearsAs}
                                                        </li>
                                                    ) :
                                                    <li>None Listed</li>
                                                }
                                            </ul>

                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-semibold text-teal-700">Director:</h2>
                                            <Link className="underline cursor-pointer" to={"/p/" + movie.director.id}>{movie.director.fname}  {movie.director.lname}</Link>
                                            <h2 className="mt-5 text-2xl font-semibold text-teal-700">Release Date:</h2>
                                            <p>{movie.releaseDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-70 h-105 mb-5 bg-gray-800 shrink-0">
                                <img src={movie.coverArt} className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </section>

                <ReviewForm movieID={params.movieID} user={user} />

                <section className="p-10 ">
                    {reviews.map((i, index) =>
                        <div className="border m-5 rounded-md border-green-700 bg-green-100/50" key={index}>
                            <div className="flex p-2 bg-gradient-to-r from-teal-700 to-green-700/85 text-white/80">
                                <span className="flex-1 font-semibold">
                                    <Link to={"/u/" + i.author}>{i.username}</Link>
                                </span>
                                <div className=" flex text-amber-500 shadow-amber-600">
                                    {starsFromNumber(i.rating).map((i, index) => <span key={index}>{i}</span>)}
                                </div>
                            </div>
                            <p className="p-2">{i.msg}</p>
                        </div>
                    )}
                </section>
            </>
        );
    else
        return <NotFound />;
}

export default Movie;