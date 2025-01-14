import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../firebase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const HomeMenu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
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

    // Filter products and limit to 8 items
    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .slice(0, 8); // Only show first 8 products

    return (
        <section id="menu" className="min-w-screen min-h-[75vh] border-t-2 border-[#D9D9D9] bg-brownpage">
            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
                    Item added to cart!
                </div>
            )}

            <div className="flex flex-row">
                <div className="flex flex-col p-6 w-[350px] min-h-[75vh] border-r-2 border-[#D9D9D9]">
                    <div className="mb-8">
                        <div className="w-full h-14 bg-LogoFooter bg-contain bg-no-repeat bg-center"></div>
                    </div>
                    <div className="space-y-4 mb-8">
                        <h2 className="font-semibold mb-4">Categories</h2>   
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Cari Produk"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <span className="absolute right-3 w-5 h-5 bg-SearchIcon bg-cover top-2.5"></span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <details className="cursor-pointer">
                            <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(selectedCategory === 'hot-coffee' ? null : 'hot-coffee');
                                    }}>
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
                            <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(selectedCategory === 'cake' ? null : 'cake');
                                    }}>
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
                            <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(selectedCategory === 'food' ? null : 'food');
                                    }}>
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
                            <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCategory(selectedCategory === 'drinks' ? null : 'drinks');
                                    }}>
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
                <div className="w-full min-h-full pt-8">
                    <div className="mb-8 text-center items-center">
                        <h2 className="font-sans font-[700] text-lg mr-0 md:text-2xl mb-2">Menu Kami</h2>
                        <p className="font-sans font-[500] text-[#716C6C] text-base md:text-lg mr-0 text-center">Nikmati berbagai menu kami yang banyak variannya</p>
                    </div>
                    <div className="flex flex-wrap gap-4 px-6">
                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredProducts.length === 0 ? (
                            <p>No products found.</p>
                        ) : (
                            filteredProducts.map((product) => (
                                <Link to={`/menu/item/${product.id}`} key={product.id}>
                                    <div className="w-[153px] md:w-[230px] bg-white rounded-2xl shadow-2xl relative overflow-hidden">
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
                                                className="absolute bottom-4 right-4 bg-white text-black rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-xl pb-1">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    <Link to="/menu" className="flex justify-center mt-4">
                        <div className="p-3 md:p-4 bg-[#E6D5B7] m-6 min-w-32 md:min-w-64 rounded-[26px]">
                            <h1 className="font-sans font-[500] text-[20px]">See All</h1>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeMenu;
