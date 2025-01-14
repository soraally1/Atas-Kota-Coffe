import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const HomeFirst = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                // Fetch all products
                const productsQuery = query(collection(db, "products"));
                const productsSnapshot = await getDocs(productsQuery);
                const products = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Fetch all ratings
                const ratingsQuery = query(collection(db, "ratings"));
                const ratingsSnapshot = await getDocs(ratingsQuery);
                const ratings = ratingsSnapshot.docs.map(doc => doc.data());

                // Calculate average rating for each product
                const productsWithRatings = products.map(product => {
                    const productRatings = ratings.filter(rating => rating.productId === product.id);
                    const averageRating = productRatings.length > 0
                        ? productRatings.reduce((acc, curr) => acc + curr.rating, 0) / productRatings.length
                        : 0;
                    return {
                        ...product,
                        averageRating,
                        ratingCount: productRatings.length
                    };
                });

                // Sort products by average rating and get top 7
                const sortedProducts = productsWithRatings
                    .sort((a, b) => {
                        // First sort by average rating
                        if (b.averageRating !== a.averageRating) {
                            return b.averageRating - a.averageRating;
                        }
                        // If ratings are equal, sort by number of ratings
                        return b.ratingCount - a.ratingCount;
                    })
                    .slice(0, 7);

                setBestSellers(sortedProducts);
            } catch (error) {
                console.error("Error fetching best sellers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setAddingToCart(product.id);
            await addToCart(product, 1);
            alert('Product added to cart!');
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        } finally {
            setAddingToCart(null);
        }
    };

    const handleProductClick = (productId) => {
        if (productId) {
            navigate(`/menu/item/${productId}`);
        } else {
            console.error("Product ID is undefined");
        }
    };

    return (
        <section id="Top" className="w-full min-h-screen bg-brownpage top-0 m-0 p-0">
            {/* Hero Section */}
            <div className="pt-32 md:pt-24 px-4 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left Side - Icon and Description */}
                    <div className="flex-1 flex flex-col items-start space-y-8 max-w-lg xl:ml-24 2xl:ml-60">
                        {/* Large Icon/Logo */}
                        <div className="w-full flex justify-center">
                            <div className="h-24 w-96 2xl:h-64 2xl:w-[28rem] bg-Logo bg-contain bg-no-repeat bg-center"/>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 font-sans font-[400] text-lg md:text-xl">
                            Hai, Selamat datang di atas kota
                            selamat menikmati beberapa hidangan kami
                        </p>
                    </div>

                    {/* Right Side - Coffee Image */}
                    <div className="flex-1 flex justify-center items-center h-[525px]">
                        <div className="h-[170px] w-[200px] sm:h-[255px] sm:w-[400px] md:h-[340px] md:h[400px] xl:h-[442px] xl:w-[520px] 2xl:h-[510px] 2xl:w-[600px] bg-Coffee bg-cover bg-center bg-no-repeat rounded-2xl"/>
                    </div>
                </div>
            </div>

            {/* Best Sellers Section */}
            <div className="px-4 md:px-12 lg:px-24">
                {/* Title */}
                <div className="text-left mb-6">
                    <h2 className="text-3xl font-sans font-[700] italic">Best Seller</h2>
                    <p className="text-gray-600 text-sm mt-1">Based on customer ratings</p>
                </div>

                {/* Scrollable Container */}
                <div className="flex overflow-x-auto space-x-2 md:space-x-6 pb-6 scrollbar-hide">
                    {loading ? (
                        <div className="w-full flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : bestSellers.length === 0 ? (
                        <div className="w-full text-center py-8 text-gray-500">
                            No products found
                        </div>
                    ) : (
                        bestSellers.map((product) => (
                            <div 
                                key={product.id} 
                                className="flex-none cursor-pointer"
                                onClick={() => handleProductClick(product.id)}
                            >
                                <div className="w-[153px] md:w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <div 
                                            className="h-[200px] md:h-[300px] w-full bg-cover bg-center" 
                                            style={{ backgroundImage: `url(${product.imageUrl})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        
                                        {/* Rating Badge */}
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center">
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <span className="ml-1 text-sm font-medium">
                                                {product.averageRating.toFixed(1)}
                                            </span>
                                        </div>
                                        
                                        <div className="absolute bottom-0 text-left left-0 p-4 text-white">
                                            <h3 className="font-semibold text-base md:text-xl">{product.title}</h3>
                                            <p className="pl-1 text-white text-sm md:text-base">Rp {product.price.toLocaleString()}</p>
                                            <div className="flex items-center mt-1 text-sm text-white/80">
                                                <span>{product.ratingCount} ratings</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)}
                                            disabled={addingToCart === product.id}
                                            className="absolute bottom-4 right-4 bg-white text-black rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                                        >
                                            {addingToCart === product.id ? (
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <span className="text-xl pb-1">+</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default HomeFirst; 