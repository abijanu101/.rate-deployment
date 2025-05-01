import { Link, useNavigate } from "react-router-dom";
import ButtonFilled from "../commons/buttonFilled";
import { useEffect, useRef, useState } from "react";

function Login() {
    const navigate = useNavigate();

    const email = useRef();
    const password = useRef();

    const [feedback, setFeedback] = useState('');

    function handleSubmit() {
        if (!email.current.value || !password.current.value)
            setFeedback("Missing Required Fields!");
        else {
            fetch(import.meta.env.VITE_BACKENDURL + '/users/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.current.value,
                    pw: password.current.value
                })
            })
                .then(async res => {
                    if (res.status >= 200 && res.status < 300) {
                        const body = await res.json();
                        localStorage.setItem('token', body.token);
                        navigate('/m/');
                    }
                    else {  
                        const body = await res.json();
                        setFeedback(body.message);
                    }
                })
                .catch(err => console.err(err))

        }
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-teal-700 to-green-600/80 green-700 flex">
            <div className="flex flex-col" >
                <div className="h-10"></div>
                <div className="bg-white h-110 rounded-4xl pl-10 -ml-10">
                    <Link className="text-5xl text-green-700 text-center font-serif m-10 line-clamp-1" to="/home">d⨀tRate</Link>

                    <div className="flex-col flex mx-10">
                        <input ref={email} type="email" placeholder="Email" className="p-2 border-green-800 border-2 rounded-md flex-1 mb-5" />
                        <input ref={password} type="password" placeholder="Password" className="p-2 border-green-800 border-2 rounded-md flex-1 mb-5" />
                    </div>

                    {feedback != '' &&
                        <div className="bg-rose-100/50 text-rose-800/80 cursor-not-allowed mx-10 rounded-lg my-5 p-2 border-rose-800/50 border-2 border-dashed">
                            {feedback}
                        </div>
                    }

                    <div className="flex mx-15 mt-7 gap-5">
                        <div>
                            <ButtonFilled text="Login" onClick={handleSubmit} />
                        </div>
                        <div className="flex-1 text-right -mt-0.5">Don't have an account? <Link to="/signup/" className="text-green-800 underline">Sign Up!</Link>!</div>

                    </div>
                </div>
            </div>
            <div className="font-serif flex-1/5">
                <div className="flex flex-col h-screen -mt-20 mr-10">
                    <div className="h-100">&nbsp;</div>
                    <h1 className="text-9xl text-teal-50 text-left ml-20 font-serif">Welcome Back</h1>
                    <p className="text-5xl text-white text-center ml-20 font-serif">to the sp⨀t</p>
                </div>
            </div>
        </div>
    )
}

export default Login;