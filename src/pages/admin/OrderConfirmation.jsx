import { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BarsArrowDownIcon } from '@heroicons/react/20/solid';
import { MdDashboard, MdShoppingCart, MdHistory, MdInventory, MdPayment, MdPrint, MdAccessTime, MdPerson, MdChair, MdReceipt } from "react-icons/md";
import PropTypes from 'prop-types';

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
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired
    })).isRequired,
    total: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    seatNumber: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
};

const OrderConfirmation = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }

        const fetchPendingOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("status", "==", "pending"),
                    where("paymentMethod", "==", "cash")
                );
                const querySnapshot = await getDocs(q);
                const orders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPendingOrders(orders);
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingOrders();
    }, [user, isAdmin, navigate]);

    const handleConfirmPayment = async (orderId) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: "paid",
                paidAt: new Date().toISOString()
            });

            // Find the confirmed order and show its receipt
            const confirmedOrder = pendingOrders.find(order => order.id === orderId);
            setSelectedOrder(confirmedOrder);
            setShowReceipt(true);

            // Update local state
            setPendingOrders(prevOrders => 
                prevOrders.filter(order => order.id !== orderId)
            );
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Failed to confirm payment. Please try again.");
        }
    };

    return (
        <div className="bg-brownpage min-h-screen relative flex flex-col md:flex-row">
            {/* Mobile Menu Button */}

            {/* Sidebar */}
            <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r-2 border-[#D9D9D9] transform transition-transform duration-200 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } z-40`}>
                <div className="flex flex-col h-full">
                    <div className="text-center py-8 border-b border-gray-200">
                        <h1 className="font-sans font-[700] text-[24px]">Dashboard Admin</h1>
                    </div>
                    
                    <nav className="flex-1 py-6 px-4 space-y-4">
                        <Link 
                            to="/admin/product" 
                            className="flex items-center px-4 py-3 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdInventory className="w-6 h-6 mr-3 text-gray-700" />
                            <span className="font-sans font-[600] text-lg">Products</span>
                        </Link>

                        <Link 
                            to="/admin/orders" 
                            className="flex items-center px-4 py-3 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdShoppingCart className="w-6 h-6 mr-3 text-gray-700" />
                            <span className="font-sans font-[600] text-lg">Orders</span>
                        </Link>

                        <Link 
                            to="/admin/order-confirmation" 
                            className="flex items-center px-4 py-3 rounded-xl bg-[#EBEBEB] hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdPayment className="w-6 h-6 mr-3 text-gray-700" />
                            <span className="font-sans font-[600] text-lg text-left">Payment Confirmation</span>
                        </Link>

                        <Link 
                            to="/admin/transaction" 
                            className="flex items-center px-4 py-3 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdDashboard className="w-6 h-6 mr-3 text-gray-700" />
                            <span className="font-sans font-[600] text-lg">Transaction</span>
                        </Link>

                        <Link 
                            to="/admin/history" 
                            className="flex items-center px-4 py-3 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdHistory className="w-6 h-6 mr-3 text-gray-700" />
                            <span className="font-sans font-[600] text-lg">Riwayat</span>
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

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0 mb-16 md:mb-0">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment Confirmation</h1>
                            <p className="text-gray-600 mt-1">Manage pending cash payments</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-800">{pendingOrders.length}</p>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow-md">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading pending orders...</p>
                        </div>
                    ) : showReceipt && selectedOrder ? (
                        <div className="max-w-2xl mx-auto">
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 hover:bg-white rounded-lg transition-all"
                            >
                                <span>←</span> Back to Pending Orders
                            </button>
                            <ReceiptCard
                                orderNumber={selectedOrder.orderNumber}
                                items={selectedOrder.items}
                                total={selectedOrder.total}
                                customerName={selectedOrder.customerName}
                                seatNumber={selectedOrder.seatNumber}
                                paymentMethod={selectedOrder.paymentMethod}
                                createdAt={selectedOrder.createdAt}
                            />
                        </div>
                    ) : pendingOrders.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow-md">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MdReceipt className="w-8 h-8 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Pending Payments</h2>
                            <p className="text-gray-600">All cash payments have been confirmed</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {pendingOrders.map(order => (
                                <div key={order.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MdReceipt className="w-5 h-5 text-gray-600" />
                                                <h2 className="text-xl font-semibold text-gray-800">Order #{order.orderNumber}</h2>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MdPerson className="w-4 h-4" />
                                                    <span>{order.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MdChair className="w-4 h-4" />
                                                    <span>Seat {order.seatNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MdAccessTime className="w-4 h-4" />
                                                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto">
                                            <div className="bg-gray-50 rounded-lg p-4 text-right">
                                                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                                <p className="text-2xl font-bold text-gray-800">
                                                    Rp {order.total.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{item.title}</span>
                                                        <span className="text-sm text-gray-500">x{item.quantity}</span>
                                                    </div>
                                                    <span className="text-gray-800">Rp {(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleConfirmPayment(order.id)}
                                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <MdPayment className="w-5 h-5" />
                                            Confirm Payment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 