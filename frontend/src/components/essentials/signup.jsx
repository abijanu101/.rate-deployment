import { Link } from "react-router-dom";
import ButtonFilled from "../commons/buttonFilled";
import { useRef, useState } from "react";

function Signup() {
    const email = useRef();
    const username = useRef();
    const password = useRef();
    const confirmation = useRef();

    const [feedback, setFeedback] = useState('');
    ;
    function handleSubmit() {
        if (!email.current.value || !username.current.value || !password.current.value || !confirmation.current.value)
            setFeedback('All Fields Are Required!');
        else if (password.current.value != confirmation.current.value)
            setFeedback('Password does not match!');
        else if (
            false
            // here, check if email is duplicate
        )
            setFeedback('This email is already under use!');
        else {
            setFeedback('');
        }

    }


    return (
        <div className="w-screen h-screen bg-gradient-to-r from-teal-700 to-green-600/80 green-700 flex">
            <div className="font-serif flex-1/5">
                <div className="flex flex-col h-screen -mt-20 mr-10">
                    <div className="flex-1">&nbsp;</div>
                    <h1 className="text-5xl text-teal-50 text-center font-serif">share your</h1>
                    <p className="text-9xl text-white text-right font-serif">p⨀int of View</p>
                </div>
            </div>
            <div className="flex-1 bg-white" >
                <Link className="text-5xl text-green-700 text-center font-serif m-10 line-clamp-1" to="/home">d⨀tRate</Link>

                <div className="flex-col flex mx-10">
                    <input ref={email} type="email" placeholder="Email" className="p-2 border-green-800 border-2 rounded-md flex-1 mb-5" />
                    <input ref={username} type="text" placeholder="Username" className="p-2 border-green-800 border-2 rounded-md flex-1 mb-5" />
                    <input ref={password} type="password" placeholder="Password" className="p-2 border-green-800 border-2 rounded-md flex-1 mb-5" />
                    <input ref={confirmation} type="password" placeholder="Confirm Password" className="p-2 border-green-800 border-2 rounded-md flex-1" />
                </div>
                
                {feedback != '' &&
                    <div className="bg-rose-100/50 text-rose-800/80 cursor-not-allowed mx-10 rounded-lg my-5 p-2 border-rose-800/50 border-2 border-dashed">
                        {feedback}
                    </div>
                }

                <div className="flex mx-15 mt-7 gap-5">
                    <div>
                        <ButtonFilled text="Sign Up" onClick={handleSubmit} />
                    </div>
                    <div className="flex-1 text-right -mt-0.5">Already have an account? <Link to="/login/" className="text-green-800 underline">Login</Link>!</div>

                </div>
            </div>

        </div>
    )
}

export default Signup;