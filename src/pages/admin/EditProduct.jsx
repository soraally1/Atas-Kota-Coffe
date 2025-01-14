import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { updateProduct } from "../../firebase";
import { MdDashboard, MdShoppingCart, MdHistory, MdInventory, MdCloudUpload, MdPayment } from "react-icons/md";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        description: "",
        imageUrl: ""
    });
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        // Get product data from localStorage
        const productData = localStorage.getItem('editProduct');
        if (productData) {
            const product = JSON.parse(productData);
            setFormData({
                title: product.title || "",
                price: product.price || "",
                category: product.category || "",
                description: product.description || "",
                imageUrl: product.imageUrl || ""
            });
            setPreviewUrl(product.imageUrl || "");
        }
    }, []);

    // Predefined categories
    const categories = {
        coffee: [
            { id: "hot-coffee", name: "Hot Coffee" },
            { id: "iced-coffee", name: "Iced Coffee" },
            { id: "espresso", name: "Espresso Based" },
            { id: "manual-brew", name: "Manual Brew" }
        ],
        nonCoffee: [
            { id: "tea", name: "Tea" },
            { id: "chocolate", name: "Chocolate" },
            { id: "smoothies", name: "Smoothies" },
            { id: "soft-drinks", name: "Soft Drinks" }
        ],
        food: [
            { id: "main-course", name: "Main Course" },
            { id: "pasta", name: "Pasta" },
            { id: "rice-bowl", name: "Rice Bowl" },
            { id: "sandwich", name: "Sandwich" }
        ],
        snacks: [
            { id: "french-fries", name: "French Fries" },
            { id: "chicken-wings", name: "Chicken Wings" },
            { id: "nuggets", name: "Nuggets" },
            { id: "light-bites", name: "Light Bites" }
        ],
        desserts: [
            { id: "cakes", name: "Cakes" },
            { id: "ice-cream", name: "Ice Cream" },
            { id: "pastries", name: "Pastries" },
            { id: "cookies", name: "Cookies" }
        ]
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    };

    const handleFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setFormData(prev => ({
                ...prev,
                imageUrl: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert("Please select an image");
            return;
        }
        setLoading(true);
        try {
            await updateProduct(id, {
                title: formData.title,
                price: parseFloat(formData.price),
                category: formData.category,
                description: formData.description,
                imageUrl: formData.imageUrl
            });

            navigate("/admin/product");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-brownpage min-h-screen relative flex flex-col md:flex-row">
            {/* Mobile Menu Button */}

            {/* Desktop Sidebar */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transform transition-transform duration-200 ease-in-out fixed md:relative w-64 h-screen bg-white border-r-2 border-[#D9D9D9] z-40 md:w-1/6 hidden md:block`}>
                <h1 className="text-center font-sans font-[700] text-[24px] mt-10">Dashboard Admin</h1>
                <nav className="flex-1 mt-10">
                    <Link 
                        to="/admin/product" 
                        className="flex items-center px-4 py-2 mx-4 rounded-xl bg-[#EBEBEB] hover:bg-[#d9d9d9] transition-colors"
                    >
                        <MdInventory className="w-6 h-6 mr-2" />
                        <span className="font-sans font-[600] text-xl">Products</span>
                    </Link>

                    <Link 
                        to="/admin/orders" 
                        className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                    >
                        <MdShoppingCart className="w-6 h-6 mr-2" />
                        <span className="font-sans font-[600] text-xl">Orders</span>
                    </Link>

                    <Link 
                        to="/admin/order-confirmation" 
                        className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                    >
                        <MdPayment className="w-6 h-6 mr-2" />
                        <span className="font-sans font-[600] text-xl">Payment Confirmation</span>
                    </Link>

                    <Link 
                        to="/admin/transaction" 
                        className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                    >
                        <MdDashboard className="w-6 h-6 mr-2" />
                        <span className="font-sans font-[600] text-xl">Transaction</span>
                    </Link>

                    <Link 
                        to="/admin/history" 
                        className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                    >
                        <MdHistory className="w-6 h-6 mr-2" />
                        <span className="font-sans font-[600] text-xl">Riwayat</span>
                    </Link>
                </nav>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around items-center py-2">
                    <Link to="/admin/product" className="flex flex-col items-center p-2">
                        <MdInventory className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Products</span>
                    </Link>
                    <Link to="/admin/orders" className="flex flex-col items-center p-2">
                        <MdShoppingCart className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Orders</span>
                    </Link>
                    <Link 
                        to="/admin/order-confirmation" className="flex flex-col items-center p-2">
                        <MdPayment className="w-6 h-6 mr-2"/>
                        <span className="text-xs mt-1">Payment <br/> Confirmation</span>
                    </Link>
                    <Link to="/admin/transaction" className="flex flex-col items-center p-2">
                        <MdDashboard className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Transaction</span>
                    </Link>
                    <Link to="/admin/history" className="flex flex-col items-center p-2">
                        <MdHistory className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Riwayat</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 mt-16 md:mt-0 mb-16 md:mb-0">
                <h1 className="font-sans font-[700] text-2xl md:text-3xl mb-6">Products</h1>
                <div className="mx-2 md:mx-10">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <h1 className="font-sans font-[600] text-xl md:text-2xl">Edit Product</h1>
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="py-2 px-8 md:px-12 bg-white border border-[#9B9999] rounded-lg font-sans font-[700] text-lg md:text-xl text-[#818080] disabled:opacity-50">
                            {loading ? "Saving..." : "Update"}
                        </button>
                    </div>
                    <form className="w-full mt-6 md:mt-10 p-4 md:p-10 bg-white rounded-xl border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 md:row-span-3">
                                <div 
                                    onClick={() => fileInputRef.current.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center gap-4 ${
                                        isDragging ? 'border-blue-500 bg-blue-50' : previewUrl ? 'border-green-500' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <img 
                                                src={previewUrl} 
                                                alt="Preview" 
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                <p className="text-white text-center">Click or drag to change image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <MdCloudUpload className="w-12 h-12 text-gray-400" />
                                            <div className="text-center">
                                                <p className="text-gray-600">Click or drag image to upload</p>
                                                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <input 
                                    type="text" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-xl border-2" 
                                    placeholder="Title" 
                                />
                            </div>
                            <div className="md:col-start-3">
                                <input 
                                    type="number" 
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-xl border-2" 
                                    placeholder="Price" 
                                />
                            </div>
                            <div className="md:col-start-4">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-xl border-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select Category</option>
                                    <optgroup label="Coffee">
                                        {categories.coffee.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Non-Coffee Drinks">
                                        {categories.nonCoffee.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Food">
                                        {categories.food.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Snacks">
                                        {categories.snacks.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Desserts">
                                        {categories.desserts.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div className="md:col-span-2 md:row-span-2">
                                <textarea 
                                    name="description" 
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4" 
                                    placeholder="Description" 
                                    className="w-full p-3 rounded-xl border-2 resize-none">
                                </textarea>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct; 