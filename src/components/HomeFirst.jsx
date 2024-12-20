import React from "react";
import { Link } from "react-router-dom";

const HomeFirst = () => {
    return (
        <section id="Top" className="w-full min-h-screen bg-[#FFFBF2] top-0 m-0 p-0">
            {/* Hero Section */}
            <div className="pt-24 px-4 md:px-12 lg:px-24 ">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left Side - Icon and Description */}
                    <div className="flex-1 flex flex-col items-start space-y-8 max-w-lg xl:ml-24 2xl:ml-60">
                        {/* Large Icon/Logo */}
                        <div className="w-full flex justify-center ">
                            <div className="h-48 w-96 2xl:h-64 2xl:w-[28rem] bg-Logo bg-contain bg-no-repeat bg-center"/>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 font-sans font-[400] text-lg md:text-xl">
                        Hai, Selamat datang di atas kota
                        selamat menikmati beberapa hidangan kami
                        </p>
                    </div>

                    {/* Right Side - Coffee Image */}
                    <div className="flex-1 flex justify-center items-center h-[525px] ">
                        <div className="h-[340px] w-[400px] xl:h-[442px] xl:w-[520px] 2xl:h-[510px] 2xl:w-[600px] bg-Coffee bg-cover bg-center bg-no-repeat rounded-2xl"/>
                    </div>
                </div>
            </div>
            {/* Horizontal scroll section / menu items */}
            <div className="px-4 md:px-12 lg:px-24 ">
                {/* Title */}
                <div className="text-left mb-6">
                    <h2 className="text-3xl font-sans font-[700] italic ">Best Seller</h2>
                </div>

                {/* Scrollable Container */}
                <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide ">
                    {/* Menu Item 1 */}
                    <Link to="/menu/caffe-latte" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                <div className="h-[300px] w-full bg-CaffeLatte bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Caffe Latte</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                    {/* Menu Item 2 */}
                    <Link to="/menu/alfredo-pasta" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                {/* Image with gradient overlay */}
                                <div className="h-[300px] w-full bg-Alfredo bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Alfredo Pasta</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                {/* Plus button */}
                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                    {/* Menu Item 3 */}
                    <Link to="/menu/chicken-pasta" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                {/* Image with gradient overlay */}
                                <div className="h-[300px] w-full bg-ChickenPasta bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Chicken Pasta</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                {/* Plus button */}
                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                    {/* Menu Item 4 */}
                    <Link to="/menu/item" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                {/* Image with gradient overlay */}
                                <div className="h-[300px] w-full bg-RotiBakar bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Roti Bakar</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                {/* Plus button */}
                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                    {/* Menu Item 5 */}
                    <Link to="/menu/espresso" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                {/* Image with gradient overlay */}
                                <div className="h-[300px] w-full bg-Espresso bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Espresso</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                {/* Plus button */}
                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                    {/* Menu Item 6 */}
                    <Link to="/menu/espresso" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                {/* Image with gradient overlay */}
                                <div className="h-[300px] w-full bg-Espresso bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Espresso</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                {/* Plus button */}
                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                    {/* Menu Item 7 */}
                    <Link to="/menu/espresso" className="flex-none">
                        <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                            <div className="relative">
                                {/* Image with gradient overlay */}
                                <div className="h-[300px] w-full bg-Espresso bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Text overlay */}
                                <div className="absolute bottom-0 text-left left-0 p-4 text-white ">
                                    <h3 className="font-semibold text-xl">Espresso</h3>
                                    <p className="pl-1 text-white">Rp 21.000</p>
                                </div>

                                {/* Plus button */}
                                <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                    <span className="text-xl pb-1">+</span>
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HomeFirst;