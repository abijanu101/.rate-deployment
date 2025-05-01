import { FaRegStar, FaStar } from "react-icons/fa";

export function starsFromNumber(number, key) {
        let result = [];
        let i = 0;
        for (; i < number; ++i)
            result.push(<FaStar key={key * -10 - i} />);

        for (; number < 5; ++number)
            result.push(<FaRegStar key={key * -10 - number} />);

        return result;
    }