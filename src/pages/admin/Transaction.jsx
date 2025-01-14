import { Link } from "react-router-dom";
import { MdDashboard, MdShoppingCart, MdHistory, MdInventory, MdPayment } from "react-icons/md";
import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Transaction = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('Minggu'); // Minggu, Bulan, Tahun
    const [transactionType, setTransactionType] = useState('Earning'); // Earning, Spending
    const [stats, setStats] = useState({
        earning: 0,
        spending: 0,
        saving: 0,
        percentageIncrease: 0
    });

    // Get date range based on filter
    const getDateRange = (filter) => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date(now);

        switch(filter) {
            case 'Minggu':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'Bulan':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'Tahun':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    };

    // Fetch transactions when time filter changes
    useEffect(() => {
        fetchTransactions();
    }, [timeFilter]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { startDate, endDate } = getDateRange(timeFilter);

            const q = query(
                collection(db, "orders"),
                where("createdAt", ">=", startDate.toISOString()),
                where("createdAt", "<=", endDate.toISOString()),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const transactionData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt || new Date().toISOString()
            }));

            setTransactions(transactionData);
            calculateStats(transactionData, startDate, endDate);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data, startDate, endDate) => {
        // Calculate total earnings
        const totalEarning = data.reduce((sum, transaction) => {
            return sum + (transaction.total || 0);
        }, 0);

        // Calculate spending (example: 27.5% of earnings)
        const totalSpending = totalEarning * 0.275;
        
        // Calculate saving
        const totalSaving = totalEarning - totalSpending;

        // Calculate percentage increase
        const previousPeriodStart = new Date(startDate);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const previousPeriodData = data.filter(transaction => {
            const date = new Date(transaction.createdAt);
            return date >= previousPeriodStart && date < startDate;
        });

        const previousTotal = previousPeriodData.reduce((sum, transaction) => sum + (transaction.total || 0), 0);
        const percentageIncrease = previousTotal === 0 ? 100 : ((totalEarning - previousTotal) / previousTotal) * 100;

        setStats({
            earning: totalEarning,
            spending: totalSpending,
            saving: totalSaving,
            percentageIncrease
        });
    };

    // Prepare chart data
    const prepareBarChartData = useMemo(() => {
        const labels = [];
        const earningData = [];
        const spendingData = [];

        // Create time periods based on filter
        const periods = timeFilter === 'Minggu' ? 7 : timeFilter === 'Bulan' ? 4 : 12;
        const periodLabel = timeFilter === 'Minggu' ? 'Day' : timeFilter === 'Bulan' ? 'Week' : 'Month';

        for (let i = 0; i < periods; i++) {
            labels.push(`${periodLabel} ${i + 1}`);
            const periodTransactions = transactions.filter(transaction => {
                const date = new Date(transaction.createdAt);
                const now = new Date();
                const periodStart = new Date(now);
                const periodEnd = new Date(now);

                if (timeFilter === 'Minggu') {
                    periodStart.setDate(now.getDate() - (periods - i));
                    periodEnd.setDate(now.getDate() - (periods - i - 1));
                } else if (timeFilter === 'Bulan') {
                    periodStart.setDate(now.getDate() - (periods - i) * 7);
                    periodEnd.setDate(now.getDate() - (periods - i - 1) * 7);
                } else {
                    periodStart.setMonth(now.getMonth() - (periods - i));
                    periodEnd.setMonth(now.getMonth() - (periods - i - 1));
                }

                return date >= periodStart && date < periodEnd;
            });

            const periodEarning = periodTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
            const periodSpending = periodEarning * 0.275;

            earningData.push(periodEarning);
            spendingData.push(periodSpending);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Earning',
                    data: earningData,
                    backgroundColor: '#00FF00',
                    borderRadius: 8,
                },
                {
                    label: 'Spending',
                    data: spendingData,
                    backgroundColor: '#FF0000',
                    borderRadius: 8,
                }
            ]
        };
    }, [transactions, timeFilter]);

    // Chart options
    const donutOptions = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed}%`
                }
            }
        }
    };

    const donutChartData = useMemo(() => ({
        labels: ['Earning', 'Spending', 'Saving'],
        datasets: [{
            data: [
                ((stats.earning / (stats.earning || 1)) * 100).toFixed(1),
                ((stats.spending / (stats.earning || 1)) * 100).toFixed(1),
                ((stats.saving / (stats.earning || 1)) * 100).toFixed(1)
            ],
            backgroundColor: ['#00FF00', '#FF0000', '#0088FF'],
            borderWidth: 0,
        }]
    }), [stats]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            if (transactionType === 'Earning') {
                return transaction.total > 0;
            } else {
                return transaction.total < 0;
            }
        });
    }, [transactions, transactionType]);

    return (
        <div className="bg-brownpage min-h-screen relative flex flex-col md:flex-row">

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
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl bg-[#EBEBEB] hover:bg-[#d9d9d9] transition-colors"
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

            {/* Content - Make it wider and adjust padding */}
            <div className="flex-3 p-8 md:p-8 mt-16 md:mt-0 mb-16 md:mb-0">
                <h1 className="font-sans font-[700] text-2xl md:text-3xl mb-8">Transaction</h1>
                <div className="mx-0 md:mx-4 grid grid-cols-12 gap-8">
                    {/* Statistics Chart */}
                    <div className="col-span-12 lg:col-span-8 bg-white p-6 md:p-8 rounded-[20px] shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <h2 className="font-sans font-[600] text-2xl">Statistik</h2>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#00FF00]"></div>
                                        <span className="text-sm">Earning</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
                                        <span className="text-sm">Spending</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select 
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                        className="appearance-none bg-white pl-4 pr-8 py-2 rounded-[14px] border border-gray-200 shadow-sm text-sm focus:outline-none"
                                        disabled={loading}
                                    >
                                        <option value="Minggu">Month</option>
                                        <option value="Bulan">Year</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                <Bar data={prepareBarChartData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: '#E5E5E5',
                                                drawBorder: false,
                                                borderDash: [5, 5]
                                            },
                                            ticks: {
                                                callback: (value) => `Rp.${value.toLocaleString()}`,
                                                font: {
                                                    size: 12
                                                },
                                                padding: 10
                                            },
                                            border: {
                                                display: false
                                            }
                                        },
                                        x: {
                                            grid: {
                                                display: false,
                                                drawBorder: false
                                            },
                                            ticks: {
                                                font: {
                                                    size: 12
                                                },
                                                padding: 5
                                            },
                                            border: {
                                                display: false
                                            }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        tooltip: {
                                            backgroundColor: '#000',
                                            padding: 12,
                                            titleFont: {
                                                size: 14,
                                                weight: 'normal'
                                            },
                                            bodyFont: {
                                                size: 13
                                            },
                                            displayColors: false,
                                            callbacks: {
                                                title: () => 'Earning',
                                                label: (context) => `Rp.${context.parsed.y.toLocaleString()}`,
                                                labelTextColor: () => '#fff'
                                            },
                                            yAlign: 'bottom',
                                            caretSize: 8,
                                            caretPadding: 15
                                        }
                                    },
                                    interaction: {
                                        intersect: false,
                                        mode: 'index'
                                    },
                                    elements: {
                                        bar: {
                                            borderRadius: 8,
                                            borderSkipped: false
                                        }
                                    },
                                    layout: {
                                        padding: {
                                            top: 30
                                        }
                                    }
                                }} />
                            )}
                        </div>
                    </div>

                    {/* Saving Stats */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 md:p-8 rounded-[20px] shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-sans font-[600] text-2xl">Saving</h2>
                            <div className="relative">
                                <select 
                                    className="appearance-none bg-white pl-4 pr-8 py-2 rounded-[14px] border border-gray-200 shadow-sm text-sm focus:outline-none"
                                    disabled={loading}
                                >
                                    <option>Month</option>
                                    <option>Year</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-[32px] font-bold">Rp.{stats.saving.toLocaleString()}</span>
                            <span className="px-2 py-1 bg-[#DCFFD0] text-[#00B087] rounded-full text-sm font-medium">
                                +{stats.percentageIncrease.toFixed(1)}%
                            </span>
                        </div>
                        <div className="relative h-[220px] mb-8">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Doughnut data={donutChartData} options={donutOptions} />
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <div className="text-sm text-gray-500">Saving</div>
                                        <div className="font-bold text-lg">{((stats.saving / (stats.earning || 1)) * 100).toFixed(1)}%</div>
                                        <div className="text-sm text-gray-500">Rp.{stats.saving.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                                        <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                                        <div className="h-1 w-full bg-gray-200 rounded-full"></div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <div className="text-gray-500 text-sm">Earning</div>
                                        <div className="font-bold text-lg">{((stats.earning / (stats.earning || 1)) * 100).toFixed(1)}%</div>
                                        <div className="text-sm text-gray-600">Rp.{stats.earning.toLocaleString()}</div>
                                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#00FF00] rounded-full" style={{ width: `${((stats.earning / (stats.earning || 1)) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-gray-500 text-sm">Spending</div>
                                        <div className="font-bold text-lg">{((stats.spending / (stats.earning || 1)) * 100).toFixed(1)}%</div>
                                        <div className="text-sm text-gray-600">Rp.{stats.spending.toLocaleString()}</div>
                                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#FF0000] rounded-full" style={{ width: `${((stats.spending / (stats.earning || 1)) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-gray-500 text-sm">Saving</div>
                                        <div className="font-bold text-lg">{((stats.saving / (stats.earning || 1)) * 100).toFixed(1)}%</div>
                                        <div className="text-sm text-gray-600">Rp.{stats.saving.toLocaleString()}</div>
                                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0088FF] rounded-full" style={{ width: `${((stats.saving / (stats.earning || 1)) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Transaction Details - Make it full width */}
                    <div className="col-span-12 bg-white p-6 md:p-8 rounded-lg shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <h2 className="font-sans font-[600] text-xl">Detail Transaction</h2>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex gap-2">
                                    <button 
                                        className={`px-6 py-2 rounded-lg ${timeFilter === 'Minggu' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                        onClick={() => setTimeFilter('Minggu')}
                                        disabled={loading}
                                    >
                                        Minggu
                                    </button>
                                    <button 
                                        className={`px-6 py-2 rounded-lg ${timeFilter === 'Bulan' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                        onClick={() => setTimeFilter('Bulan')}
                                        disabled={loading}
                                    >
                                        Bulan
                                    </button>
                                    <button 
                                        className={`px-6 py-2 rounded-lg ${timeFilter === 'Tahun' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                        onClick={() => setTimeFilter('Tahun')}
                                        disabled={loading}
                                    >
                                        Tahun
                                    </button>
                                </div>
                                <select 
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="p-2 border rounded-lg min-w-[120px]"
                                    disabled={loading}
                                >
                                    <option value="Earning">Earning</option>
                                    <option value="Spending">Spending</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                            <div>
                                                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                ))
                            ) : filteredTransactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No transactions found for the selected period
                                </div>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 ${transaction.total >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                                                <span className={transaction.total >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                    {transaction.total >= 0 ? '→' : '←'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-semibold">{transaction.customerName || 'Anonymous'}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(transaction.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`font-semibold ${transaction.total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {transaction.total >= 0 ? '+' : '-'} Rp.{Math.abs(transaction.total).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transaction;