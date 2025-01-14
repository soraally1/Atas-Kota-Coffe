import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../firebase";
import { FaCaretUp, FaCaretDown, FaCoffee } from "react-icons/fa";
import { RiDrinks2Fill } from "react-icons/ri";
import { PiBowlFoodBold, PiIceCream } from "react-icons/pi";
import { GiFrenchFries, GiBrokenBottle } from "react-icons/gi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = async (e, product) => {
        e.preventDefault(); // Prevent navigation to product details
        
        if (!user) {
            window.location.href = '/login';
            return;
        }

        await addToCart(product);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
                    Item added to cart!
                </div>
            )}

            <div className="flex pt-20">
                {/* Mobile Menu Button */}
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed bottom-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg">
                    <FaCaretUp className="w-6 h-6"/>
                </button>
                {/* Left Side - Navigation */}
                <div className={`${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'} md:translate-y-0 transform transition-transform duration-300 ease-in-out w-[200px] md:w-[280px] min-h-screen md:block backdrop-blur bg-black/25 md:bg-white ml-5 md:ml-10 mt-6 rounded-xl z-40 fixed p-6 shadow-lg`}>
                    {/* Logo */}
                    <div className="mb-8" onClick={() => setSelectedCategory('')}>
                        <h1 className="text-xl font-bold">ATAS KOTA</h1>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h2 className="font-semibold mb-4">Categories</h2>
                        
                        {/* Search Bar */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Cari"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <span className="absolute right-3 w-5 h-5 bg-SearchIcon bg-cover top-2.5"></span>
                        </div>

                        {/* Dropdown Menus */}
                        <div className="space-y-2">
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <FaCoffee className="w-5 h-5 mr-2"/>
                                    Coffee
                                </summary>
                                <div className="pl-3 md:pl-7 py-2 text-left space-y-2">
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('hot-coffee')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Hot Coffee</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('iced-coffee')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Iced Coffee</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('espresso')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Espresso based</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('manual-brew')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Manual Brew</p>
                                    </Link>
                                </div>
                            </details>
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <RiDrinks2Fill className="w-5 h-5 mr-2"/>
                                    Non Coffee
                                </summary>
                                <div className="pl-3 md:pl-7 py-2 text-left space-y-2">
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('tea')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Tea</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('chocolate')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Chocolate</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('smoothies')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Smoothies</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('soft-drinks')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Soft Drinks</p>
                                    </Link>
                                </div>
                            </details>
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <PiBowlFoodBold className="w-5 h-5 mr-2"/>
                                    Food
                                </summary>
                                <div className="pl-3 md:pl-7 py-2 text-left space-y-2">
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('main-course')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Main Course</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('pasta')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Pasta</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('rice-bowl')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Rice Bowl</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('sandwich')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Sandwich</p>
                                    </Link>
                                </div>
                            </details>
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <GiFrenchFries className="w-5 h-5 mr-2"/>
                                    Snacks
                                </summary>
                                <div className="pl-3 md:pl-7 py-2 text-left space-y-2">
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('french-fries')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">French Fries</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('chicken-wings')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Chicken Wings</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('nuggets')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Nuggets</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('light-bites')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Light Bites</p>
                                    </Link>
                                </div>
                            </details>
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <PiIceCream className="w-5 h-5 mr-2"/>
                                    Dessets
                                </summary>
                                <div className="pl-3 md:pl-7 py-2 text-left space-y-2">
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('cakes')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Cakes</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('ice-cream')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Ice Cream</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('pastries')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Pastries</p>
                                    </Link>
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('cookies')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Cookies</p>
                                    </Link>
                                </div>
                            </details>
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                                    <GiBrokenBottle className="w-5 h-5 mr-2"/>
                                    Other
                                </summary>
                                <div className="pl-3 md:pl-7 py-2 text-left space-y-2">
                                    <Link to="/menu/"
                                        onClick={() => setSelectedCategory('miscellaneous')} 
                                    >
                                    <p className="hover:bg-gray-100 hover:text-black text-white md:text-black p-1 pl-2 rounded-md">Miscellaneous</p>
                                    </Link>
                                    
                                </div>
                            </details>

                            {/* <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                        onClick={() => setSelectedCategory('drinks')}>
                                    <span className="w-5 h-5 mr-2 bg-DrinkIcon bg-cover bg-center"></span>
                                    Drinks
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 text-white p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 text-white p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 text-white p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details> */}
                        </div>
                    </div>
                </div>

                {/* Right Side - Menu Items */}
                <div className="flex-1 p-8 min-w-[225px] md:ml-[320px]">
                    {/* Menu Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Menu Kami</h2>
                        <p className="text-gray-600">Nikmati berbagai menu kami yang banyak variannya</p>
                    </div>

                    {/* Menu Grid */}
                    <div className="flex flex-wrap gap-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredProducts.length === 0 ? (
                            <p>No products found.</p>
                        ) : (
                            filteredProducts.map((product) => (
                                <Link to={`/menu/item/${product.id}`} key={product.id}>
                                    <div className="w-[153px] md:w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden z-0">
                                        <div className="relative">
                                            <div 
                                                className="h-[200px] md:h-[300px] w-full bg-cover bg-center" 
                                                style={{ backgroundImage: `url(${product.imageUrl})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            
                                            <div className="absolute bottom-0 text-left left-0 p-4 text-white">
                                                <h3 className="font-semibold text-base md:text-xl">{product.title}</h3>
                                                <p className="pl-1 text-white text-sm md:text-base">Rp {product.price.toLocaleString()}</p>
                                            </div>

                                            <button 
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-xl pb-1">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;