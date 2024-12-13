import React from "react";

const Location = () => {
    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">   
            <div className="pt-32 px-4"> 
                {/* Upper/title */}
                <div className="flex-col mb-8">
                    <h1 className="font-sans font-[700] text-xl">
                        Our Location
                    </h1>
                    <h1 className="font-sans font-[500]">
                        Segera kunjungi coffee shop kami
                    </h1>
                </div>
                
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    {/* Location information */}
                    <div className="w-full xl:ml-20 md:ml-12 md:w-1/2 bg-white rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-sans font-[700] mb-2">Atas Kota Coffee & Space</h2>
                        <h3 className="text-xl font-sans font-[700] mb-4">Semarang ataskota</h3>
                        
                        {/* Address */}
                        <div className="flex items-start gap-2 mb-4">
                            <div className="w-6 h-6 mt-1 bg-LocationIcon bg-no-repeat bg-center bg-contain"></div>
                            <a href="https://maps.app.goo.gl/bdNfDzmMRDPVmgvEA" className="font-sans font-[600]">Gg. Kedawung V, Patemon, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50228</a>
                        </div>

                        {/* Opening Hours */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-ClockIcon bg-no-repeat bg-center bg-contain"></div>
                            <p className="font-sans font-[600]">Jam buka 10.00 - 00.00</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xl font-sans font-[600]">4.7</span>
                            <div className="flex">
                                {[1, 2, 3, 4].map((star) => (
                                    <div 
                                        key={star} 
                                        className="w-5 h-5 bg-StarIcon bg-no-repeat bg-center bg-contain"
                                    ></div>
                                ))}
                                <div className="w-5 h-5 bg-HalfStarIcon bg-no-repeat bg-center bg-contain "></div>
                            </div>
                            <span className="text-gray-500 font-sans font-[600]">(606)</span>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="font-semibold mb-3">Fasilitas:</h3>
                            <div className="grid grid-cols-2 gap-3 font-sans">
                                {['Memiliki Bar', 'Toilet', 'Wifi', 'Free Wifi'].map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-CheckIcon bg-no-repeat bg-center bg-contain"></div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="xl:mr-20 md:mr-12 w-full md:w-1/2 h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.5866469852263!2d110.3913036116634!3d-7.057758169137772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708bd27764634b%3A0x50b2672623549688!2sAtas%20Kota%20Coffee%20%26%20Space!5e0!3m2!1sen!2sid!4v1733735703633!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg shadow-md"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Location;
