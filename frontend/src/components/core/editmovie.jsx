import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { RiDeleteBinFill } from "react-icons/ri";
import { meta } from "@eslint/js";

// figure out genre submission

function EditMovie() {
    const params = useParams();
    // form values
    const title = useRef();
    const [file, setFile] = useState(); // image file binary
    const date = useRef();
    const synopsis = useRef();
    const director = useRef();
    const [actors, setActors] = useState([]);
    const [genres, setGenres] = useState([]);

    // actors stuff
    const [people, setPeople] = useState([]);
    const actorChosen = useRef();
    const actorRole = useRef();
    const actorsPKGen = useRef(0); // the actors needs a primary key because actorID may be repeated incase of double roles

    // genre stuff
    const [allGenres, setAllGenres] = useState([]);
    const genreChosen = useRef();

    // other view stuff
    const [image, setImage] = useState(); // temp url for img preview
    const [feedback, setFeedback] = useState([]);

    const navigate = useNavigate();

    // initialization

    useEffect(() => {
        // populate movie attributes
        fetch(import.meta.env.VITE_BACKENDURL + '/movies/' + params.movieID, { method: 'GET' })
            .then(res => res.json())
            .then(res => {
                const buffer = new Uint8Array(res.imageBin.data);
                const blob = new Blob([buffer], { type: res.imageMIME });

                title.current.value = res.title,
                    synopsis.current.value = res.synopsis,
                    director.current.value = res.director;
                date.current.value = res.releasedOn.slice(0, 10);
                setFile(blob);
                setImage(URL.createObjectURL(blob));
                setActors(() => {
                    let result = [];
                    for (const d of res.actors)
                        result.push({
                            'pk': actorsPKGen.current++,
                            'actorID': d.id,
                            'fname': d.fname,
                            'lname': d.lname,
                            'appearsAs': d.appearsAs
                        })
                    return result;
                });
            })
            .catch(err => console.error(err));

        fetch(import.meta.env.VITE_BACKENDURL + '/genres/' + params.movieID, { method: 'GET' })
            .then(res => res.json())
            .then(usedGenres => {
                if (usedGenres[0])
                    setGenres(() => {
                        let result = [];
                        for (const g of usedGenres)
                            result.push({ id: g.id, name: g.gname });
                        return result;
                    });

                // populate genre options for drop down
                fetch(import.meta.env.VITE_BACKENDURL + '/genres/', { method: "GET" })
                    .then(res => res.json())
                    .then(genreOptions => {
                        if (usedGenres[0])
                            setAllGenres(() => {
                                let result = [];
                                for (const g of genreOptions)
                                    if (!usedGenres.find(i => i.id === g.id))
                                        result.push({ id: g.id, name: g.name });
                                return result;
                            });
                        else
                            setAllGenres(genreOptions);
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));

        // populate drop down options

        fetch(import.meta.env.VITE_BACKENDURL + '/people/', { method: "GET" })
            .then(res => res.json())
            .then(res => setPeople(res))
            .catch(err => console.error(err));
    }, []);


    // ----------------------------- handlers ----------------------------- 

    function handleFileUpload(event) {
        setFile(event.target.files[0]);
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    function handleActorAddition() {
        if (!actorRole.current.value) {
            setFeedback(["Actor Role"])
            return;
        };
        if (actors.find((i) => i.actorID == actorChosen.current.value && i.appearsAs == actorRole.current.value))
            return;
        setFeedback([]);

        const actorChosenDetails = people.find((i) => i.id == actorChosen.current.value);

        setActors((prev) => {
            let result = prev;
            result.push({
                'pk': actorsPKGen.current++,
                'actorID': actorChosenDetails.id,
                'fname': actorChosenDetails.fname,
                'lname': actorChosenDetails.lname,
                'appearsAs': actorRole.current.value
            });
            return result;
        });
    }
    function handleActorRemoval(event) {
        setActors((prev) => {
            let result = [];
            for (const i of prev) {
                // upon clicking the button, the target turns out to be the child of the icon component instead of the icon itself as its not really a HTML tag
                if (i.pk != event.target.parentElement.id)  // hence we do .parentElement 
                    result.push(i);
            }
            return result;
        })
    }
    function handleGenreAddition() {
        const genreChosenDetails = allGenres.find((i) => i.id == genreChosen.current.value);
        if (!genreChosenDetails)
            return;

        setGenres((prev) => {
            let result = prev;
            result.push({
                'id': genreChosenDetails.id,
                'name': genreChosenDetails.name
            });
            return result;
        });

        // prevent duplicates
        setAllGenres(prev => {
            let result = [];
            for (const i of prev) {
                // upon clicking the button, the target turns out to be the child of the icon component instead of the icon itself as its not really a HTML tag
                if (i.id != genreChosenDetails.id)  // hence we do .parentElement 
                    result.push(i);
            }
            return result;
        })
    }
    function handleGenreRemoval(event) {
        setGenres(prev => {
            let result = [];
            for (const i of prev) {
                // upon clicking the button, the target turns out to be the child of the icon component instead of the icon itself as its not really a HTML tag
                if (i.id != event.target.parentElement.id)  // hence we do .parentElement 
                    result.push(i);
                else
                    setAllGenres((all) => {
                        let result = allGenres;
                        result.push(i);
                        return result;
                    });
            }
            return result;
        })
    }
    function handleSubmission() {
        let string = []
        if (!title.current.value)
            string.push("Title");
        if (!file)
            string.push("Cover Image");
        if (!date.current.value)
            string.push("Release Date");
        if (!synopsis.current.value)
            string.push("Plot Synopsis");
        setFeedback(string);

        if (string.length === 0) {
            setFeedback([]);

            const formData = new FormData();
            formData.append('id', params.movieID)
            formData.append('title', title.current.value);
            formData.append('director', director.current.value);
            formData.append('image', file);
            formData.append('releasedOn', date.current.value);
            formData.append('synopsis', synopsis.current.value);
            formData.append('actors', JSON.stringify(actors));
            formData.append('genres', JSON.stringify(genres));

            // PUT
            fetch(import.meta.env.VITE_BACKENDURL + "/movies/" + params.movieID, {
                method: 'PUT',
                body: formData
            })
                .then(() => navigate('/m/' + params.movieID))
                .catch(err => console.error(err));
        }
    }

    // ----------------------------- html ----------------------------- 

    return (
        <div className="p-5">
            <h1 className="text-3xl flex-1 p-2 border-b border-green-800">Edit Movie</h1>
            <p className="text-center text-gray-400 text-sm mt-5">
                <span className="text-teal-800/50 font-semibold">Tip:</span> Remember that nothing is saved until you Press Submit!
            </p>

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
                <div className="flex gap-10">
                    <div className="flex-1 shrink-1">
                        <textarea placeholder="Plot Synopsis" className="w-full h-25 p-2 border-green-800 border-2 rounded-md" ref={synopsis} />

                        <section className="p-5">
                            <h2 className="text-2xl font-semibold text-teal-700 ">Director</h2>
                            <div className="flex flex-row justify-center">
                                <select ref={director} className="w-40">
                                    {
                                        people.map((i, index) => <option key={index} value={i.id}>{i.fname} {i.lname}</option>)
                                    }
                                </select>
                            </div>
                        </section>

                        {/* actors */}
                        <section className="p-5">
                            <h2 className="text-2xl font-semibold text-teal-700 ">Cast</h2>

                            <div className="flex flex-row gap-3 mt-5 justify-center">
                                <select className="w-40 border-teal-700" ref={actorChosen}>
                                    {people.map((i, index) => <option key={index} value={i.id}>{i.fname} {i.lname}</option>)}
                                </select>
                                <i className="text-teal-700">as</i>
                                <input type="text" className="w-35 border-b border-green-800" ref={actorRole} />
                                <p className="pl-1 text-xl mt-1 text-teal-700 cursor-pointer hover:text-green-600 active:text-green-600/80 transition-colors duration-300">
                                    <BsFillPlusCircleFill onClick={handleActorAddition} />
                                </p>
                            </div>

                            <div className="px-10 my-5 flex justify-center cursor-not-allowed">
                                <div className="w-full h-30 border border-green-800 text-gray-900 rounded-xs overflow-y-scroll">
                                    {actors.map((i, index) =>
                                        <div key={index} className="cursor-default flex p-1 gap-2 border-b border-green-800 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 transition-colors duration-200">
                                            <div className="flex-1">{i.fname} {i.lname} <i className="text-teal-700">as</i> {i.appearsAs}</div>
                                            <button id={i.pk} onClick={handleActorRemoval} className="text-xl text-red-800/50 hover:text-red-800/90 active:text-red-800 mt-0.5 cursor-pointer">
                                                <RiDeleteBinFill id={i.pk} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="p-5 pt-0">
                            <h2 className="text-2xl font-semibold text-teal-700 ">Genre</h2>

                            <div className="flex flex-row gap-3 mt-5 justify-center">
                                <select className="w-40 border-teal-700" ref={genreChosen}>
                                    {allGenres.map((i, index) => <option key={index} value={i.id}>{i.name}</option>)}
                                </select>
                                <p className="pl-1 text-xl mt-1 text-teal-700 cursor-pointer hover:text-green-600 active:text-green-600/80 transition-colors duration-300">
                                    <BsFillPlusCircleFill onClick={handleGenreAddition} />
                                </p>
                            </div>

                            <div className="px-10 my-5 flex justify-center cursor-not-allowed">
                                <div className="w-full h-30 border border-green-800 text-gray-900 rounded-xs overflow-y-scroll">
                                    {genres.map((i, index) =>
                                        <div key={index} className="cursor-default flex p-1 gap-2 border-b border-green-800 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 transition-colors duration-200">
                                            <div className="flex-1">{i.name}</div>
                                            <button id={i.id} onClick={handleGenreRemoval} className="text-xl text-red-800/50 hover:text-red-800/90 active:text-red-800 mt-0.5 cursor-pointer">
                                                <RiDeleteBinFill id={i.id} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                    </div>
                    <div className="w-70 h-105 bg-gray-800 shrink-0">
                        <img src={image} className="w-full h-full" />
                        <p className="text-center text-gray-500">Recommended Size: 1400x2100</p>
                    </div>

                </div>

                <div className="mt-5">
                    {feedback.length != 0 &&
                        <div className="p-3 bg-red-100 border-2 border-dashed border-red-500/50 text-red-900/85 mb-3">
                            Missing Required Fields:
                            <ul className="pl-5">
                                {feedback.map((i, index) => <li key={index}>{i}</li>)}
                            </ul>
                        </div>
                    }
                    <div className="w-full flex flex-row justify-center">
                        <div onClick={handleSubmission} className="shadow-md shadow-green-800/50 active:brightness-110 p-2 px-5 border-2 border-green-800 rounded-md hover:text-green-800 hover:from-teal-800/0 hover:to-green-800/0 bg-gradient-to-r from-teal-800 text-white to-green-700 transition-colors duration-300">
                            Submit
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditMovie;