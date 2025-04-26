import { useEffect, useRef, useState } from "react";
import { BsCameraReels, BsCameraReelsFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import ButtonFilled from "../commons/buttonFilled";
import { FaRegStar, FaStar } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import ReviewForm from "./reviewform";

function Movie() {
    // initializing contents

    const params = useParams(); // use params.movieID to send initial fetch request

    const [movie, setMovie] = useState({
        title: 'Movie Name',
        details: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos sunt dolorum voluptas quia labore quaerat, voluptatibus in dicta expedita ipsam, optio ab rem veritatis vel voluptate mollitia non, autem accusantium.",
        coverArt: null,
        director: { id: '0', fname: 'John', lname: 'Doe' },
        actors: [
            { id: '1', fname: "Emma", lname: 'Watson', as: "Jesse" },
            { id: '2', fname: "Alex", lname: 'Bull', as: "Holly" },
            { id: '3', fname: "Thomas", lname: 'Jefferson', as: "Bill" }
        ],
        releaseDate: "2004/03/12"
    });
    const [reviews, setReviews] = useState(
        [
            { author: '1', fname: 'Commenter', lname: 'Name', rating: '5', body: 'Great Movie fr fr' },
            { author: '2', fname: 'Literally', lname: 'Me', rating: '3', body: 'Had its moments' },
            { author: '3', fname: 'Skibidius', lname: 'Tolietus', rating: '1', body: 'CHICKEN JOCKEYYY!!!!' },
            { author: '4', fname: 'Not', lname: 'Cool', rating: '3', body: 'Sad :(' },
        ]);

    const [user, setUser] = useState(
        { username: "abijanu101", isAdmin: 'Y' }
    )

    // Helpers

    function starsFromNumber(number) {
        let result = [];
        for (let i = 0; i < number; ++i)
            result.push(<FaStar />);

        for (; number < 5; ++number)
            result.push(<FaRegStar />);

        return result;
    }

    function handleDelete() {

    }

    // Use Effect

    useEffect(() => {
        // fetch movie using params.movieID
        // fetch reviews using params.movieID
        // fetch user using login


    }, []);

    if (movie)
        return (
            <>
                <section className="w-full bg-gradient-to-br from-green-300/50 to-teal-200/25 py-10">
                    <div className="px-5 md:px-15 lg:px-25">
                        <div className="flex flex-row gap-10">
                            <div className="flex-1 shrink">
                                <div className="border-b-2 flex">
                                    <h1 className="text-5xl flex-1 p-5 border-green-800">{movie.title}</h1>
                                    {user.isAdmin == 'Y' && <>
                                        <span className="text-4xl mt-8 flex gap-2">
                                            <Link className="hover:rotate-0 rotate-5 transition-all duration-300" to={"/m/edit/" + params.movieID}><BiEdit /></Link>
                                            <span className="hover:rotate-0 rotate-5 transition-all duration-300"><BiTrash onClick={handleDelete} /></span>

                                        </span>
                                    </>}
                                </div>
                                <div className="p-3">
                                    <h2 className="text-2xl font-semibold text-teal-700">Synopsis:</h2>
                                    <p>{movie.details}</p>
                                    <div className="flex py-5">
                                        <div className="w-70">
                                            <h2 className="text-2xl font-semibold text-teal-700">Actors:</h2>
                                            <ul>
                                                {movie.actors.map((i, index) =>
                                                    <li key={index}>-&gt;&nbsp;
                                                        <Link className="underline cursor-pointer" to={"/p/" + i.id}>
                                                            {i.fname} {i.lname}</Link> as {i.as}
                                                    </li>
                                                )}
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
                            <div className="flex p-2 bg-gradient-to-r from-teal-800 to-green-800 text-white/80">
                                <span className="flex-1 font-semibold">
                                    <Link to={"u/" + i.id}>{i.fname} {i.lname}</Link>
                                </span>
                                <div className=" flex text-amber-500 shadow-amber-600">
                                    {starsFromNumber(i.rating).map((i, index) => <span key={index}>{i}</span>)}
                                </div>
                            </div>
                            <p className="p-2">{i.body}</p>
                        </div>
                    )}
                </section>
            </>
        );
    else
        return (
            <div className="flex text-center m-10">
                <div className="w-40"></div>
                <div className="flex-1 font-serif">
                    <h1 className="text-5xl font-bold p-5 border-b-3 text-gray-800 border-green-800/50">Movie Not Found :&#40;</h1>
                    <div className="flex justify-center pt-20">
                        <h2 style={{ 'font-size': '20rem' }}>
                            <BsCameraReelsFill className="block m-0 text-teal-800/20" />
                            <BsCameraReels className="block m-0 text-green-800/50 -mt-80" />
                            <p style={{ 'font-size': '25rem' }} className="block m-0 -mt-115 rotate-25 text-gray-800">/</p>
                        </h2>
                    </div>
                    <p className='mb-10 text-2xl'>There are still many more movies to explore!</p>
                    <ButtonFilled text="Return Home" dest="/home/" />
                </div>
                <div className="w-40"></div>
            </div>
        )

}

export default Movie;