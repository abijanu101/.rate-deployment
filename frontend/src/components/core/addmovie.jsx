import { useRef, useState } from "react";
import ButtonFilled from "../commons/buttonFilled";
import { useNavigate } from "react-router-dom";

function AddMovie() {
    // form values
    const title = useRef();
    const [file, setFile] = useState();
    const date = useRef();
    const synopsis = useRef();

    // view stuff
    const [image, setImage] = useState();
    const [feedback, setFeedback] = useState(null);

    const navigate = useNavigate();

    // handlers

    function handleFileUpload(event) {
        setFile(event.target.files[0]);
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    function handleSubmission() {
        if (!title.current.value || !file || !date.current.value || !synopsis.current.value)
            setFeedback("Must input all fields!");
        else {
            setFeedback(null);

            const formData = new FormData();
            formData.append('title', title.current.value);
            formData.append('image', file);
            formData.append('release_date', date.current.value);
            formData.append('synopsis', synopsis.current.value);

            // post here

            navigate('/m/');
        }
    }

    // component

    return (
        <div className="p-5">
            <h1 className="text-3xl flex-1 p-2 border-b border-green-800">Add a Movie</h1>

            <div className="m-5 flex flex-col gap-3">
                <div className="flex gap-6">
                    <input type="text" placeholder="Movie Title" className="p-2 border-green-800 border-2 rounded-md flex-1" ref={title} />
                    <div className="flex gap-6">
                        {
                            file ?
                                <label htmlFor="mv_img" className="p-2 px-5 border-2 border-green-800 rounded-md hover:text-green-800 hover:from-teal-800/0 hover:to-green-800/0 bg-gradient-to-r from-teal-800 text-white to-green-700 transition-colors duration-300">Replace Image</label>
                                :
                                <label htmlFor="mv_img" className="p-2 px-5 border-2 border-green-800 rounded-md hover:text-green-800 hover:from-teal-800/0 hover:to-green-800/0 bg-gradient-to-r from-teal-800 text-white to-green-700 transition-colors duration-300">Upload an Image</label>
                        }
                        <input id="mv_img" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                    <input type="date" placeholder="Date" className="p-2 border-green-800 border-2 rounded-md" ref={date} />
                </div>
                <div className="flex gap-5">
                    <div className="flex-1 shrink-1">
                        <textarea placeholder="Plot Synopsis" className="w-full h-25 p-2 border-green-800 border-2 rounded-md" ref={synopsis} />

                    </div>
                    <div className="w-70 h-105 bg-gray-800 shrink-0">
                        <img src={image} className="w-full h-full" />
                        <p className="text-center text-gray-500">Recommended Size: 1400x2100</p>
                    </div>

                </div>

                {feedback &&
                    <div className="p-3 bg-red-100 border-2 border-red-500/50 text-red-900/85">{feedback}</div>
                }
                <div className="w-full flex flex-row justify-center">
                    <div onClick={handleSubmission} className="shadow-md shadow-green-800/50 active:brightness-110 p-2 px-5 border-2 border-green-800 rounded-md hover:text-green-800 hover:from-teal-800/0 hover:to-green-800/0 bg-gradient-to-r from-teal-800 text-white to-green-700 transition-colors duration-300">
                        Submit
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMovie;