import Button from "../commons/button";
import ButtonFilled from "../commons/buttonFilled";

function Home() {
    return (
        <>
            <main className="w-screen bg-gradient-to-r h-80 from-teal-700 to-green-600/85 text-white">
                <h2 className="text-4xl font-serif text-center text-white/80 pt-10 pb-5">Discover</h2>
                <h1 className="text-7xl font-serif text-center">New P⨀int of Views</h1>
                <div className="flex justify-center mt-10">
                    <Button text="Find New Movies" dest="/m/" />
                </div>
            </main>
            <section className="w-screen bg-gradient-to-br from-green-100 to-teal-100/50 p-10 flex text-teal-700">
                <div className="flex-1 mx-10">
                    <h1 className="text-4xl font-semibold font-serif mb-5">Tell the World</h1>
                    <p className="text-2xl">We invite you to share your valuable insights with the world!</p>
                    <div className="mt-7 flex flex-row-reverse"><ButtonFilled text="Signup" dest="/signup/" /></div>
                    <div className="border-b-2 border-green-700 py-5"></div>

                    <h1 className="text-2xl font-serif mb-5 my-10 text-center">Think We Missed Something? <br /><br /> <span className="font-semibold">Add and Update Movies Yourself!</span></h1>

                </div>
                <div className="w-xl h-135 overflow-hidden -rotate-5 shadow-teal-900/50 shadow-xl opacity-90 ml-10 mb-10">
                    <img src="../../reviewDemo.png" />
                </div>
            </section>

            <section className="w-screen p-10 flex justify-center bg-gradient-to-r  from-teal-700 to-green-600/85 text-white">
                <div className="w-150 -rotate-x-15 -rotate-y-10 opacity-95 backdrop-blur-md ">
                    <img src="../../editDemo.png" />
                </div>
                <div className="flex-1">
                    <h2 className="text-5xl font-serif text-center  pt-15">Contribute Today</h2>
                    <p className="text-2xl text-center text-white/80 p-10">We are hard at work trying to keep the database updated, but we sometimes miss details and so we call upon your instance to stay up to help us continue to provide our services!</p>
                </div>

            </section>
        </>
    );
}

export default Home;