import { Link } from "react-router-dom";
import { MdDashboard, MdShoppingCart, MdHistory, MdInventory, MdPrint, MdSearch, MdFilterList, MdSort, MdPayment } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Menu } from '@headlessui/react';

const ReceiptCard = ({ orderNumber, items, total, customerName, seatNumber, paymentMethod, createdAt }) => {
    const receiptRef = useRef();
    const [isPrinting, setIsPrinting] = useState(false);

    const formattedDate = new Date(createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
        const printContent = receiptRef.current;
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (!printWindow) {
                throw new Error('Please allow pop-ups for printing receipts.');
            }

        printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Print Receipt - ${orderNumber}</title>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .receipt {
                            max-width: 300px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                            padding-bottom: 10px;
                            border-bottom: 1px dashed #ccc;
                        }
                        .logo {
                            max-width: 120px;
                            margin: 0 auto 10px;
                            display: block;
                        }
                        .store-info {
                            text-align: center;
                            font-size: 14px;
                            margin-bottom: 20px;
                        }
                        .details {
                            margin-bottom: 20px;
                            font-size: 14px;
                        }
                        .details-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 10px;
                        }
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                            font-size: 14px;
                        }
                        .items-table th {
                            text-align: left;
                            padding: 8px 4px;
                            border-bottom: 1px solid #ddd;
                        }
                        .items-table td {
                            padding: 8px 4px;
                            border-bottom: 1px solid #eee;
                        }
                        .total-section {
                            margin-top: 20px;
                            padding-top: 10px;
                            border-top: 1px dashed #ccc;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            padding-top: 10px;
                            border-top: 1px solid #eee;
                            font-size: 14px;
                        }
                        @media print {
                            body {
                                padding: 0;
                            }
                            .receipt {
                                border: none;
                            }
                            @page {
                                size: 80mm auto;
                                margin: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <img src="/src/assets/Photos/Logo.png" alt="Atas Kota Coffee" class="logo">
                            <h2 style="margin: 10px 0;">Receipt Order</h2>
                            <p style="margin: 5px 0; color: #666;">Order #${orderNumber}</p>
                        </div>

                        <div class="store-info">
                            <p style="margin: 5px 0;"><strong>Atas Kota Coffee</strong></p>
                            <p style="margin: 5px 0;">Jl. Raya Kota No. 123</p>
                            <p style="margin: 5px 0;">Tel: (021) 123-4567</p>
                        </div>

                        <div class="details">
                            <div class="details-grid">
                                <div>
                                    <p style="margin: 5px 0; color: #666;">Customer</p>
                                    <p style="margin: 5px 0;"><strong>${customerName}</strong></p>
                                </div>
                                <div>
                                    <p style="margin: 5px 0; color: #666;">Seat Number</p>
                                    <p style="margin: 5px 0;"><strong>${seatNumber}</strong></p>
                                </div>
                                <div>
                                    <p style="margin: 5px 0; color: #666;">Payment Method</p>
                                    <p style="margin: 5px 0;"><strong>${paymentMethod}</strong></p>
                                </div>
                                <div>
                                    <p style="margin: 5px 0; color: #666;">Date</p>
                                    <p style="margin: 5px 0;"><strong>${formattedDate}</strong></p>
                                </div>
                            </div>
                        </div>

                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Price</th>
                                    <th style="text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td>
                                            <div><strong>${item.title}</strong></div>
                                            <div style="font-size: 12px; color: #666;">@Rp. ${item.price.toLocaleString()}</div>
                                        </td>
                                        <td style="text-align: center;">${item.quantity}</td>
                                        <td style="text-align: right;">Rp. ${item.price.toLocaleString()}</td>
                                        <td style="text-align: right;"><strong>Rp. ${(item.price * item.quantity).toLocaleString()}</strong></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="total-section">
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                                <span style="color: #666;">Subtotal</span>
                                <span><strong>Rp. ${total.toLocaleString()}</strong></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                                <span style="color: #666;">Tax (0%)</span>
                                <span><strong>Rp. 0</strong></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                                <span><strong>Total Amount</strong></span>
                                <span style="font-size: 18px;"><strong>Rp. ${total.toLocaleString()}</strong></span>
                            </div>
                        </div>

                        <div class="footer">
                            <p style="margin: 5px 0;"><strong>Thank you for your order!</strong></p>
                            <p style="margin: 5px 0; font-size: 12px;">Please keep this receipt for your records</p>
                            <p style="margin: 15px 0 5px 0; font-size: 12px;">Follow us on social media @AtasKotaCoffee</p>
                            <p style="margin: 5px 0; font-size: 12px; color: #666;">Printed on: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 250);
                        };
                    </script>
                </body>
                </html>
            `);
        
        printWindow.document.close();
        } catch (error) {
            console.error('Print error:', error);
            alert(error.message || 'Failed to print receipt. Please try again.');
        } finally {
            setIsPrinting(false);
        }
    };

    return (
        <div className="p-6 w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div ref={receiptRef} className="space-y-4">
                {/* Header with Logo */}
                <div className="text-center border-b-2 border-dashed border-gray-200 pb-4">
                    <img 
                        src="/src/assets/Photos/Logo.png" 
                        alt="Atas Kota Coffee" 
                        className="w-32 mx-auto mb-3"
                    />
                    <h2 className="font-sans font-[600] text-2xl text-gray-800">Receipt Order</h2>
                    <p className="text-gray-500 text-sm mt-1">#{orderNumber}</p>
                </div>

                {/* Store Info */}
                <div className="text-center text-sm text-gray-600">
                    <p className="font-medium">Atas Kota Coffee</p>
                    <p>Jl. Raya Kota No. 123</p>
                    <p>Tel: (021) 123-4567</p>
                </div>

                {/* Order Details */}
                <div className="space-y-2 py-3 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-gray-600">Customer</p>
                            <p className="font-medium">{customerName}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Seat Number</p>
                            <p className="font-medium">{seatNumber}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Payment Method</p>
                            <p className="font-medium">{paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">{formattedDate}</p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-gray-600 font-medium">Item</th>
                                <th className="text-center py-2 text-gray-600 font-medium">QTY</th>
                                <th className="text-right py-2 text-gray-600 font-medium">Price</th>
                                <th className="text-right py-2 text-gray-600 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-50">
                                    <td className="py-2">
                                        <p className="font-medium text-gray-800">{item.title}</p>
                                        <p className="text-gray-500 text-xs">@Rp. {item.price.toLocaleString()}</p>
                                    </td>
                                    <td className="text-center py-2">{item.quantity}</td>
                                    <td className="text-right py-2">Rp. {item.price.toLocaleString()}</td>
                                    <td className="text-right py-2 font-medium">
                                        Rp. {(item.price * item.quantity).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Section */}
                <div className="border-t-2 border-dashed border-gray-200 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">Rp. {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tax (0%)</span>
                        <span className="font-medium">Rp. 0</span>
                            </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-medium text-gray-800">Total Amount</span>
                        <span className="font-bold text-lg">
                            Rp. {total.toLocaleString()}
                        </span>
                        </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm border-t border-gray-100 pt-4 mt-4">
                    <p className="font-medium">Thank you for your order!</p>
                    <p className="text-xs mt-1">Please keep this receipt for your records</p>
                    <p className="text-xs mt-3">Follow us on social media @AtasKotaCoffee</p>
                </div>
            </div>

            {/* Print Button */}
            <button 
                onClick={handlePrint}
                disabled={isPrinting}
                className="w-full mt-4 py-2.5 px-4 bg-[#E6D5B8] hover:bg-[#d4b87c] rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-gray-800"
            >
                <MdPrint className="w-5 h-5" />
                <span className="font-medium">
                    {isPrinting ? 'Printing...' : 'Print Receipt'}
                </span>
            </button>
        </div>
    );
};

ReceiptCard.propTypes = {
    orderNumber: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired
        })
    ).isRequired,
    total: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    seatNumber: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
};

const History = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date()
    });
    const [sortBy, setSortBy] = useState("date_desc");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, [dateRange, sortBy, filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            let q = query(collection(db, "orders"));

            // Add date range filter
            q = query(q, 
                where("createdAt", ">=", dateRange.startDate.toISOString()),
                where("createdAt", "<=", dateRange.endDate.toISOString())
            );

            // Add status filter
            if (filterStatus !== "all") {
                q = query(q, where("status", "==", filterStatus));
            }

            // Add sorting
            switch (sortBy) {
                case "date_asc":
                    q = query(q, orderBy("createdAt", "asc"));
                    break;
                case "total_desc":
                    q = query(q, orderBy("total", "desc"));
                    break;
                case "total_asc":
                    q = query(q, orderBy("total", "asc"));
                    break;
                default: // date_desc
                    q = query(q, orderBy("createdAt", "desc"));
            }

            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt || new Date().toISOString()
            }));

            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load order history. Please try again.");
        } finally {
            setLoading(false);
        }
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

    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: new Date(value)
        }));
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
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl bg-[#EBEBEB] hover:bg-[#d9d9d9] transition-colors"
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
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="font-sans font-[600] text-2xl md:text-3xl">Order Receipt History</h1>
                    <p className="font-sans text-gray-600 text-sm md:text-base mt-1">View and manage your order history</p>
                </div>

                {/* Filters and Search Section */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Date Range Filters */}
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">From</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dateRange.startDate.toISOString().split('T')[0]}
                                    onChange={handleDateRangeChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">To</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate.toISOString().split('T')[0]}
                                    onChange={handleDateRangeChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Sort and Filter Dropdowns */}
                        <div className="flex gap-4">
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                                    <MdSort />
                                    Sort By
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setSortBy('date_desc')}
                                            >
                                                Newest First
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setSortBy('date_asc')}
                                            >
                                                Oldest First
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setSortBy('total_desc')}
                                            >
                                                Highest Total
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setSortBy('total_asc')}
                                            >
                                                Lowest Total
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>

                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                                    <MdFilterList />
                                    Filter
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setFilterStatus('all')}
                                            >
                                                All Orders
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setFilterStatus('paid')}
                                            >
                                                Completed
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                                                onClick={() => setFilterStatus('pending')}
                                            >
                                                Pending
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name, or seat number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                {/* Receipts Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                            <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center text-red-600">
                            <p className="text-lg">{error}</p>
                            <button 
                                onClick={fetchOrders}
                                className="mt-4 px-6 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center text-gray-600">
                            <p className="text-lg">No orders found</p>
                            {searchTerm && (
                                <p className="mt-2 text-sm">
                                    Try adjusting your search criteria or filters
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map((order) => (
                            <ReceiptCard
                                key={order.id}
                                orderNumber={order.id}
                                items={order.items}
                                total={order.total}
                                customerName={order.customerName || 'N/A'}
                                seatNumber={order.seatNumber || 'N/A'}
                                paymentMethod={order.paymentMethod || 'N/A'}
                                createdAt={order.createdAt}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;