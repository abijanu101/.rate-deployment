import { Link } from "react-router-dom";

function Button(props) {
    return (
        <Link onClick={props.onClick} to={props.dest} className="rounded-md p-2 px-5 font-sans text-green-800 bg-green-50 shadow-md shadow-green-500/20 hover:bg-gradient-to-r hover:from-teal-700 hover:to-green-700 hover:text-white border-2 active:brightness-110 border-green-700 transition-colors duration-500">
            {props.text}
        </Link>
    );
}

export default Button;