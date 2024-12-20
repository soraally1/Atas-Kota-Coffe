import React, { useState } from "react";
import rotiImage from "/src/assets/Photos/Roti Bakar Big.png";
import latteImage from "/src/assets/Photos/Caffe Latte.png";
import espressoImage from "/src/assets/Photos/Espresso.png";

const Item = () => {
    const [quantity, setQuantity] = useState(2);
    const [selectedImage, setSelectedImage] = useState(rotiImage);

    const images = [rotiImage, latteImage, espressoImage];

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(value < 1 ? 1 : value);
    };

    const handleThumbnailClick = (imagePath) => {
        setSelectedImage(imagePath);
    };

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            <div className="max-w-6xl mx-auto p-4 md:p-8 pt-24 md:pt-32 flex flex-col md:flex-row md:gap-8">
                {/* Image gallery - Full width on mobile, half width on desktop */}
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    {/* Main Image */}
                    <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4">
                        <div 
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${selectedImage})` }}
                        />
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <div 
                                key={index}
                                className={`aspect-square bg-white rounded-lg overflow-hidden cursor-pointer ${
                                    selectedImage === image ? 'ring-2 ring-[#b69d74]' : ''
                                }`}
                                onClick={() => handleThumbnailClick(image)}
                            >
                                <div 
                                    className="w-full h-full bg-cover bg-center bg-no-repeat" 
                                    style={{ backgroundImage: `url(${image})` }}
                                /> 
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product details - Full width on mobile, half width on desktop */}   
                <div className="w-full md:w-1/2">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Roti Bakar</h1>
                    <p className="text-gray-600 mb-6">
                        Roti Bakar is a crispy, toasted snack with soft bread filled with delicious spreads like chocolate, cheese, or jam. Perfect for any time of day, it’s a simple, satisfying treat everyone loves.
                    </p>

                    <div className="bg-[#fdf6e9] p-4 md:p-6 rounded-lg mb-6">
                        <span className="text-2xl md:text-3xl font-bold">Rp. 21.000</span>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center">
                            <span className="text-lg md:text-xl font-semibold">4.7</span>
                            <div className="flex text-yellow-400 ml-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-500 ml-2 text-sm md:text-base">537 Penilaian</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-gray-700">Jumlah</span>
                        <div className="flex items-center border rounded-md">
                            <button 
                            className="px-3 md:px-4 py-2 text-xl"
                            onClick={handleDecrement}
                            >
                            -
                            </button>
                            <input 
                                type="text" 
                                value={quantity} 
                                onChange={handleInputChange}
                                className="w-12 md:w-16 text-center border-x py-2 bg-[#FFFBF2]" 
                                
                            />
                            <button 
                            className="px-3 md:px-4 py-2 text-xl"
                            onClick={handleIncrement}
                            >
                            +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 px-4 md:px-6 py-3 border-2 hover:bg-[#ccb796] hover:text-white hover:border-[#ccb796] border-[#b69d74] text-[#b69d74] rounded-lg font-semibold text-sm md:text-base">
                            Add to cart
                        </button>
                        <button className="flex-1 px-4 md:px-6 py-3 hover:bg-[#ad8e5b] bg-[#b69d74] text-white rounded-lg font-semibold text-sm md:text-base">
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Item;