import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { subscribeOrders, updateOrderStatus, seedInitialOrdersIfEmpty } from '../services/orderService';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    seedInitialOrdersIfEmpty();

    const unsubscribe = subscribeOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.displayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.mobileNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.item?.productName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FFF0F0] text-[#C4092F] border-[#FFCCCC]';
      case 'Shipped':
        return 'bg-[#E6F7FF] text-[#0066CC] border-[#B3E0FF]';
      case 'Completed':
        return 'bg-[#F5F5F5] text-[#555555] border-[#E0E0E0]';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#C4092F] mb-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <h1 className="font-heading text-2xl font-bold text-[#111111]">
              Order Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review and process recent luxury timepiece orders.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="relative w-52 sm:w-60">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] focus:ring-1 focus:ring-[#C4092F] transition-all shadow-2xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#C4092F] cursor-pointer shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Orders Table Container (Screenshot 4 matching - Compact) */}
        <div className="bg-white rounded-xl border border-[#F0E6E6] shadow-2xs overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              
              {/* Table Header */}
              <thead className="bg-[#FFF5F5] border-b border-[#F0E0E0] text-gray-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Contact Info</th>
                  <th className="py-2.5 px-3">Shipping Address</th>
                  <th className="py-2.5 px-3">Item (Watch)</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const priceFormatted = new Intl.NumberFormat('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(order.item?.price || 0);

                    return (
                      <tr key={order.id} className="hover:bg-[#FFFDFD] transition-colors">
                        
                        {/* Order ID */}
                        <td className="py-2.5 px-3 font-bold text-[#C4092F] whitespace-nowrap">
                          {order.displayId || `#ORD-${order.id.slice(0, 4)}`}
                        </td>

                        {/* Customer */}
                        <td className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#FFE5E5] text-[#C4092F] text-[9px] font-bold flex items-center justify-center flex-shrink-0 border border-[#FFC0C0]">
                              {order.initials || 'U'}
                            </span>
                            <span className="truncate max-w-[120px]">{order.customerName}</span>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                          {order.mobileNumber}
                        </td>

                        {/* Shipping Address */}
                        <td className="py-2.5 px-3 text-gray-600 max-w-[180px] truncate">
                          {order.shippingAddress}
                        </td>

                        {/* Item (Watch) */}
                        <td className="py-2.5 px-3 font-medium text-gray-900 max-w-[160px] truncate">
                          {order.item?.productName}
                        </td>

                        {/* Amount */}
                        <td className="py-2.5 px-3 font-bold text-gray-900 whitespace-nowrap">
                          ₹{priceFormatted}
                        </td>

                        {/* Payment */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-medium px-1.5 py-0.5 rounded border border-gray-200">
                            📦 {order.paymentMethod || 'COD'}
                          </span>
                        </td>

                        {/* Interactive Status Toggle Pill */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none transition-colors ${getStatusBadgeStyle(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="bg-[#FFF5F5] px-4 py-2.5 border-t border-[#F0E0E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Showing 1 to {filteredOrders.length} of {orders.length} orders
            </div>

            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-6 h-6 rounded bg-[#C4092F] text-white font-bold flex items-center justify-center text-xs">
                1
              </button>
              <button className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50 text-xs">
                2
              </button>
              <button className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50 text-xs">
                3
              </button>
              <span className="px-1 text-gray-400 text-xs">...</span>
              <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
