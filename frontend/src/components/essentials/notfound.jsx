function NotFound() {
    return (
        <div className="flex text-center m-10">
            <div className="w-40"></div>
            <div className="flex-1 font-serif">
                <h1 className="text-5xl font-bold p-5 border-b-3 text-gray-800 border-green-800/50">Webpage Not Found :&#40;</h1>
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
    );
}

export default NotFound;