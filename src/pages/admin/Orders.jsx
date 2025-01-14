import { Link } from "react-router-dom";
import { CalendarIcon, ArrowTrendingUpIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Select } from '@headlessui/react'
import { MdDashboard, MdShoppingCart, MdHistory, MdInventory, MdPayment } from "react-icons/md";
import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../../firebase";

const Orders = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("today");
    const [timeFilter, setTimeFilter] = useState("last_week");
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalCustomers: 0,
        percentageIncrease: 0
    });

    useEffect(() => {
        fetchOrders();
    }, [dateFilter, timeFilter]);

    const getDateRange = () => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        // Set time filter
        switch(timeFilter) {
            case "last_month":
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case "yesterday":
                startDate.setDate(startDate.getDate() - 1);
                endDate.setDate(endDate.getDate() - 1);
                break;
            case "last_7_days":
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "last_30_days":
                startDate.setDate(startDate.getDate() - 30);
                break;
            default: // last_week
                startDate.setDate(startDate.getDate() - 7);
                break;
        }

        // Apply date filter within the time range
        switch(dateFilter) {
            case "yesterday":
                startDate = new Date(now.setDate(now.getDate() - 1));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "2days":
                startDate = new Date(now.setDate(now.getDate() - 2));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "3days":
                startDate = new Date(now.setDate(now.getDate() - 3));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            default: // today
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
        }

        return { startDate, endDate };
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const { startDate, endDate } = getDateRange();

            const q = query(
                collection(db, "orders"),
                where("createdAt", ">=", startDate.toISOString()),
                where("createdAt", "<=", endDate.toISOString()),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt || new Date().toISOString()
            }));

            setOrders(ordersData);
            calculateStats(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (ordersData) => {
        const stats = {
            totalOrders: ordersData.length,
            pendingOrders: ordersData.filter(order => order.status === 'pending').length,
            completedOrders: ordersData.filter(order => order.status === 'paid').length,
            totalCustomers: new Set(ordersData.map(order => order.userId)).size,
            percentageIncrease: 0
        };

        // Calculate percentage increase based on time filter
        const now = new Date();
        const timeFrameInDays = timeFilter === 'last_month' ? 30 : 
                               timeFilter === 'last_30_days' ? 30 :
                               timeFilter === 'last_7_days' ? 7 : 
                               timeFilter === 'yesterday' ? 1 : 7;

        const currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(currentPeriodStart.getDate() - timeFrameInDays);
        
        const previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - timeFrameInDays);

        const currentPeriodOrders = ordersData.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= currentPeriodStart && orderDate <= now;
        }).length;

        const previousPeriodOrders = ordersData.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= previousPeriodStart && orderDate < currentPeriodStart;
        }).length;

        if (previousPeriodOrders > 0) {
            stats.percentageIncrease = ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100;
        } else if (currentPeriodOrders > 0) {
            stats.percentageIncrease = 100; // If there were no previous orders but there are current orders
        }

        setStats(stats);
    };

    // Enhanced search functionality
    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchLower) ||
            order.customerName?.toLowerCase().includes(searchLower) ||
            order.seatNumber?.toLowerCase().includes(searchLower) ||
            order.paymentMethod?.toLowerCase().includes(searchLower) ||
            order.items.some(item => 
                item.title.toLowerCase().includes(searchLower) ||
                item.price.toString().includes(searchLower)
            )
        );
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-brownpage min-h-screen relative flex flex-col md:flex-row">
            {/* Mobile Menu Button */}

            {/* Desktop Sidebar */}
            <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r-2 border-[#D9D9D9] transform transition-transform duration-200 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } z-40`}>
                <div className="flex flex-col h-full">
                    <div className="text-center py-8 border-b border-gray-200">
                        <h1 className="font-sans font-[700] text-[24px]">Dashboard Admin</h1>
                    </div>
                    <nav className="flex-1 mt-10">
                        <Link 
                            to="/admin/product" 
                            className="flex items-center px-4 py-2 mx-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdInventory className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl">Products</span>
                        </Link>

                        <Link 
                            to="/admin/orders" 
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl bg-[#EBEBEB] hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdShoppingCart className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl">Orders</span>
                        </Link>

                        <Link 
                            to="/admin/order-confirmation" 
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdPayment className="w-6 h-6 mr-2"  />
                            <span className="font-sans font-[600] text-xl text-left">Payment Confirmation</span>
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
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

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
                <h1 className="font-sans font-[700] text-2xl md:text-3xl mb-6">Orders</h1>
                <div className="mx-2 md:mx-10">   
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white border border-[#d9d9d9] rounded-xl overflow-hidden">
                        <div className="relative flex justify-center md:rounded-l-lg border-b md:border-b-0 md:border-r">
                            <CalendarIcon
                                className="w-10 h-full group pointer-events-none absolute left-0 px-2 fill-white/6"
                                aria-hidden="true"
                            />
                            <Select 
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                name="status" 
                                className="w-full pl-12 appearance-none md:rounded-l-lg border-none focus:outline-none block font-sans font-[700] text-lg"
                            >
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="2days">2 Days ago</option>
                                <option value="3days">3 Days ago</option>
                            </Select>
                        </div>
                        <div className="flex flex-col py-2 px-4 border-b md:border-b-0 md:border-r">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Total Order</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">{stats.totalOrders}</h1>
                        </div>
                        <div className="flex flex-col py-2 px-4 border-b md:border-b-0 md:border-r">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Pending</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">{stats.pendingOrders}</h1>
                        </div>
                        <div className="flex flex-col py-2 px-4 border-b md:border-b-0 md:border-r">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Completed</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">{stats.completedOrders}</h1>
                        </div>
                        <div className="flex flex-col py-2 px-4 border-b md:border-b-0 md:border-r">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Customer</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">{stats.totalCustomers}</h1>
                        </div>
                        <div className="md:rounded-r-xl flex flex-col py-2 px-4">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Persentase Order</h1>
                            <div className="flex flex-row items-center">
                                <ArrowTrendingUpIcon className={`w-6 h-6 ${stats.percentageIncrease >= 0 ? 'text-[#0BE400]' : 'text-red-500'}`}/>
                                <h1 className={`font-sans font-[700] text-base mx-2 ${stats.percentageIncrease >= 0 ? 'text-[#0BE400]' : 'text-red-500'}`}>
                                    {stats.percentageIncrease.toFixed(2)}%
                                </h1>
                                <h1 className="font-sans font-[500] text-xs text-[#959595]">Bulan Terakhir</h1>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row justify-between mt-6 md:mt-10">
                        <div className="relative mb-4 md:mb-0 md:mr-5">
                            <input 
                                type="text" 
                                placeholder="Cari" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full md:w-64 rounded-lg border py-3 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" 
                            />
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
                                <MagnifyingGlassIcon className="h-6 w-6 text-neutral-500"/>
                            </span>
                        </div>
                        <div className="relative flex items-center w-full md:w-40 border rounded-lg">
                            <Select 
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="appearance-none w-full h-full pl-10 p-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            >
                                <option value="last_week">Last week</option>
                                <option value="last_month">Last month</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="last_7_days">Last 7 days</option>
                                <option value="last_30_days">Last 30 days</option>
                            </Select>
                            <ChevronDownIcon className="w-10 h-10 px-2 left-0 absolute"/>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-[#EDECEC] border-b">
                                    <th className="py-4 px-2 text-left text-sm font-medium">ID</th>
                                    <th className="py-4 px-4 text-left text-sm font-medium">Order</th>
                                    <th className="py-4 px-4 text-left text-sm font-medium hidden md:table-cell">Customer</th>
                                    <th className="py-4 px-4 text-left text-sm font-medium hidden md:table-cell">Date</th>
                                    <th className="py-4 px-4 text-right text-sm font-medium">Total</th>
                                    <th className="py-4 px-4 text-left text-sm font-medium">Status</th>
                                    <th className="py-4 px-4 text-center text-sm font-medium hidden md:table-cell">Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                <span className="ml-2">Loading orders...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center text-red-600">
                                                <span>{error}</span>
                                                <button 
                                                    onClick={fetchOrders}
                                                    className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <span>No orders found</span>
                                                {searchTerm && (
                                                    <span className="text-sm mt-1">
                                                        Try adjusting your search or filters
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b *:py-2 *:font-sans *:font-[400] *:text-base hover:bg-gray-50 transition-colors">
                                            <th>{order.id.slice(-4)}</th>
                                            <th className="flex flex-col">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex flex-row items-center py-2">
                                                        <div 
                                                            className="w-8 h-8 bg-cover rounded-md"
                                                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                                                        />
                                                        <h1 className="pl-2 font-sans font-[500] text-base">{item.title}</h1>
                                                    </div>
                                                ))}
                                            </th>
                                            <th className="text-left">{order.customerName || 'N/A'}</th>
                                            <th className="text-left">{formatDate(order.createdAt)}</th>
                                            <th className="text-right">Rp.{order.total.toLocaleString()}</th>
                                            <th className={`text-left pl-10 ${
                                                order.status === 'paid' ? 'text-green-600' : 
                                                order.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                                            }`}>
                                                {order.status === 'paid' ? 'Completed' : 
                                                 order.status === 'pending' ? 'Pending' : order.status}
                                            </th>
                                            <th className="pr-14">{order.items.length}</th>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <span>Showing</span>
                            <span className="font-bold">1-{Math.min(filteredOrders.length, 5)}</span>
                            <span>of</span>
                            <span className="font-bold">{filteredOrders.length}</span>
                        </div>

                        {/* Add pagination logic if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;