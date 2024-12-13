import React, { useState } from "react";

const Keranjang = () => {
    const [quantity, setQuantity] = useState(2);

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

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            <div className="pt-32 xl:px-56 lg:px-24 md:px-14 sm:px-20 px-4">
                <h1 className=" text-left mb-8 font-sans font-[700] text-[36px]">Keranjang</h1>
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Left Section - Cart Items */}
                    <div className="flex-1">
                        {/* Header with Select All */}
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-[#b1b1b1] mb-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="w-5 h-5" />
                                <span className="pl-4 font-sans font-[700] text-xl">Pilih Semua</span>
                            </div>
                            <button className="text-gray-600 pr-10 font-sans font-[700] text-xl">Hapus</button>
                        </div>

                        {/* Cart Item */}
                        <div className="bg-white rounded-lg border border-[#b1b1b1] p-4">
                            <div className="flex items-start gap-4">
                                <input type="checkbox" className="w-5 h-5 mt-2" />
                                <div  className="bg-CaffeLatte w-32 h-32 rounded-lg bg-center bg-cover bg-no-repeat"/>
                                <div className="flex-1 text-left">
                                    <h3 className="font-sans font-[700] text-lg">Coffee Latte</h3>
                                    <p className="text-gray-600 font-sans font-[500] ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis obcaecati error maxime.</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className=" font-sans font-[700] ">Rp. 21.000</span>
                                        <div className="flex items-center gap-4">
                                            <button className="text-gray-600"><i className="fas fa-trash"></i></button>
                                            <div className="flex items-center">
                                                <button 
                                                    className="w-8 h-8 border rounded-l-lg bg-[#FFFBF2]"
                                                    onClick={handleDecrement}
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={quantity} 
                                                    onChange={handleInputChange}
                                                    className="w-12 h-8 text-center border-y bg-[#FFFBF2]" 
                                                />
                                                <button 
                                                    className="w-8 h-8 border rounded-r-lg bg-[#FFFBF2]"
                                                    onClick={handleIncrement}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Summary */}
                    <div className="w-full md:w-80">
                        <div className="bg-white rounded-lg border border-[#b1b1b1] p-4">
                            <h2 className="font-medium text-lg mb-4">Ringkasan</h2>
                            <div className="flex justify-between mb-4">
                                <span>Total</span>
                                <span className="font-medium">Rp. 21.000</span>
                            </div>
                            <button className="w-full bg-[#E6D5B8] text-black py-2 rounded-lg">
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Keranjang;