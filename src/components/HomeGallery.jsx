import Top1 from "../assets/Photos/gallery/Top-1.png";
import Top2 from "../assets/Photos/gallery/Top-2.png";
import Top3 from "../assets/Photos/gallery/Top-3.png";
import Top4 from "../assets/Photos/gallery/Top-4.png";
import Top5 from "../assets/Photos/gallery/Top-5.png";
import Top6 from "../assets/Photos/gallery/Top-6.png";
import Bottom1 from "../assets/Photos/gallery/Bottom-1.png";
import Bottom2 from "../assets/Photos/gallery/Bottom-2.png";
import Bottom3 from "../assets/Photos/gallery/Bottom-3.png";
import Bottom4 from "../assets/Photos/gallery/Bottom-4.png";
import Bottom5 from "../assets/Photos/gallery/Bottom-5.png";
import Bottom6 from "../assets/Photos/gallery/Bottom-6.png";

const HomeGallery = () => {
    return (
        <section id="gallery" className="w-screen min-[50vh] md:min-h-screen pt-6 border-t-2 border-[#D9D9D9] bg-brownpage">
            {/* Judul */}
            <div className="w-full min-h-full p-4">
                <h1 className="text-center text-2xl font-sans font-[700]">Our Gallery</h1>
                <p className="text-center text-lg text-[#716C6C] font-sans font-[500]">Segera coffee shop kami</p>
            </div>
            
            {/* Gallery Grid */}
            <div className="max-w-7xl min-h-[50vh] md:min-[75vh] mx-auto p-4">
                {/* Top */}
                <div className="grid grid-cols-6 gap-2 md:gap-4">
                    <div className="col-start-1 col-end-3 w-full h-[162px] md:h-[324px] rounded-lg  ">
                        <img src={Top1} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                    </div>
                    <div className="col-start-3 col-end-6">
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                            <div className="w-full h-[75px] md:h-[150px] rounded-lg ">
                                <img src={Top2} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                            <div className="w-full h-[75px] md:h-[150px] col-span-2 rounded-lg ">
                                <img src={Top3} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                            <div className="w-full h-[75px] md:h-[150px] col-span-2 rounded-lg ">
                                <img src={Top4} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                            <div className="w-full h-[75px] md:h-[150px] rounded-lg ">
                                <img src={Top5} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[162px] md:h-[324px]  rounded-lg ">
                        <img src={Top6} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                    </div>
                </div>
                {/* Bottom */}
                <div className="mt-8 grid grid-cols-6 gap-2 md:gap-4">
                    <div className="col-start-1 col-end-2 w-full h-[162px] md:h-[324px] rounded-lg ">
                       <img src={Bottom1} alt="" className="w-full h-full object-cover rounded-lg hover:scale-125 transition-transform duration-300 ease-in-out" />
                    </div>
                    <div className="col-start-2 col-end-5">
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                            <div className="w-full h-[75px] md:h-[150px] col-span-2 rounded-lg ">
                                <img src={Bottom3} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                            
                            <div className="w-full h-[75px] md:h-[150px] rounded-lg ">
                                <img src={Bottom2} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                            <div className="w-full h-[75px] md:h-[150px] rounded-lg ">
                                <img src={Bottom5} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                            <div className="w-full h-[75px] md:h-[150px] col-span-2 rounded-lg ">
                                <img src={Bottom4} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                            </div>
                        </div>
                    </div>
                    <div className="col-start-5 col-end-7 w-full h-[162px] md:h-[324px] rounded-lg ">
                        <img src={Bottom6} alt="" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out" />
                    </div>
                </div>
            </div>
        </section>
    )
};

export default HomeGallery;