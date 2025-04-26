import { Link } from "react-router-dom";

function ButtonFilled(props) {
    return (
        <Link to={props.dest} className="rounded-md p-2 px-5 font-sans bg-gradient-to-br text-white from-teal-600 to-green-600 shadow-md shadow-green-800 hover:brightness-105 active:border active:brightness-100 duration-150 border-teal-600 active:-mt-0.5">
            {props.text}
        </Link>
    );
}

export default ButtonFilled;