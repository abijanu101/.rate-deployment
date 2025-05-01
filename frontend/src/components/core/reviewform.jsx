import Button from "../commons/button";
import { useState, useRef, useEffect, useContext } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { AuthContext } from "../../contexts";


function ReviewForm(props) {
    // stars interface
    const starsGiven = useRef(1);
    const [starsVisible, setStarsVisible] = useState(1);

    // form submission
    const textAreaRef = useRef();
    const {token} = useContext(AuthContext);

    function handleSubmission() {
        try{
        fetch(import.meta.env.VITE_BACKENDURL + '/reviews/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            },
            body: JSON.stringify({
                movie: props.movieID,
                rating: starsGiven.current,
                msg: textAreaRef.current.value
            })
        })
            .then(res => console.log(res))
            .catch(err => console.error(err));
    } catch(err) {console.error(err)}
    }

    
    // helpers
    function onHoverHandler(n) {
        setStarsVisible(n);
    }
    function onHoverExitHandler() {
        setStarsVisible(starsGiven.current);
    }
    function onClickHandler(n) {
        starsGiven.current = n;
    }

    useEffect(() => {

    }, []);

    return (
        <section className="bg-gradient-to-r from-teal-700 to-green-700/80 p-10">
            <h2 className="text-4xl text-white text-center mb-2">Leave a Review!</h2>
            <p className="text-2xl text-white/75 text-center mb-5">Let the world know what you think...</p>

            {props.user ? <>
                <p className="flex text-3xl text-center justify-center-safe gap-3 text-amber-500 active:brightness-105">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span
                            key={i}
                            onMouseEnter={() => onHoverHandler(i)}  // Hover event
                            onMouseLeave={onHoverExitHandler}  // Hover exit event
                            onClick={() => onClickHandler(i)}  // Click event
                        >
                            {starsVisible >= i ? <FaStar className="cursor-pointer" /> : <FaRegStar />}
                        </span>
                    ))}
                </p>
                <textarea ref={textAreaRef} type="text" className="w-full my-5 bg-gradient-to-r duration-1000 transition-colors from-teal-700/10 to-green-700/10 hover:from-teal-700/0 hover:to-green-700/0 bg-white p-5 border border-green-800" placeholder="Enter review text here..." />
                <div className="flex flex-row w-full">
                    <div className="w-full"></div>
                    <Button className="block flex-1" text="Submit" onClick={handleSubmission} />
                    <div className="w-full"></div>
                </div>
            </> : <div className="flex align-middle justify-center">
                <Button dest="/login/" text="Sign In Now" />
            </div>}


        </section>
    )
}

export default ReviewForm;