import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            <div className="flex pt-20">
                {/* Left Side - Navigation (Added fixed positioning) */}
                <div className="w-[280px] min-h-screen bg-white ml-10 mt-6 rounded-xl fixed p-6 shadow-lg">
                    {/* Logo */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">ATAS KOTA</h1>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h2 className="font-semibold mb-4">Categories</h2>
                        
                        {/* Search Bar */}
                        <div className="relative">
                            
                            <input 
                                type="text" 
                                placeholder="Cari Produk"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <span className="absolute right-3 w-5 h-5 bg-SearchIcon bg-cover top-2.5"></span>
                        </div>

                        {/* Dropdown Menus */}
                        <div className="space-y-2">
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <span className="w-5 h-5 mr-2 bg-CoffeeIcon bg-cover bg-center"></span>
                                    Coffee
                                </summary>
                                <div className="pl-9 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>
                            
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <span className="w-5 h-5 mr-2 bg-CakeIcon bg-cover bg-center"></span>
                                    Cake
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>

                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <span className="w-5 h-5 mr-2 bg-FoodIcon bg-cover bg-center"></span>
                                    Food
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>

                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <span className="w-5 h-5 mr-2 bg-DrinkIcon bg-cover bg-center"></span>
                                    Drinks
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/item">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/item">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/item">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Right Side - Menu Items (Added margin-left to account for fixed sidebar) */}
                <div className="flex-1 p-8 ml-[320px]">
                    {/* Menu Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Menu Kami</h2>
                        <p className="text-gray-600">Nikmati berbagai menu kami yang banyak variannya</p>
                    </div>

                    {/* Menu Grid - Changed to flex with wrap */}
                    <div className="flex flex-wrap gap-4">
                        {/* Menu Item - Added fixed width */}
                        {[...Array(8)].map((_, index) => (
                            <Link to="/menu/item">
                            <div key={index} className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                                <div className="relative">
                                    <div className="h-[300px] w-full bg-Alfredo bg-cover bg-center" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    
                                    <div className="absolute bottom-0 text-left left-0 p-4 text-white">
                                        <h3 className="font-semibold text-xl">Alfredo Pasta</h3>
                                        <p className="pl-1 text-white">Rp 21.000</p>
                                    </div>

                                    <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                        <span className="text-xl pb-1">+</span>
                                    </button>
                                </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;