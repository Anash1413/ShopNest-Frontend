import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/order', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load orders");
      }
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Orders | ShopNest';
    if (token) {
      fetchOrders();
    } else {
      setError("Authorization token missing. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/order/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ _id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      toast.success("Order status updated");
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredOrders = orders.filter(o =>
    o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center pt-20 border-t border-white/10">
        <Loader2 className="h-10 w-10 animate-spin text-ochi-green mb-4" />
        <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Syncing orders log...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center px-4 pt-20 border-t border-white/10">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Error Loading Orders</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6 leading-relaxed">{error}</p>
          <button onClick={fetchOrders} className="px-6 py-3 border border-white/20 text-white rounded-full font-mono font-bold transition-all text-xs uppercase tracking-wider cursor-pointer w-full">
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full space-y-8">
        
        {/* Navigation / Header Row */}
        <div className="flex flex-col gap-4 text-left">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-ochi-green transition-colors font-mono uppercase tracking-wider cursor-pointer group mb-4"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
          
          <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4">
            <div>
              <span className="font-mono text-xs text-ochi-green uppercase tracking-widest block mb-2">
                Orders Manager
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
                Checkout Registry
              </h1>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#212121] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:border-ochi-green outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            </div>
          </header>
        </div>

        {/* Standalone Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left font-mono text-xs uppercase tracking-wider">
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
            <span className="text-white/40 block mb-2">Pending Orders</span>
            <div className="text-3xl font-black text-amber-500 font-sans leading-none">{orders.filter(o => o.status?.toLowerCase() === 'pending').length}</div>
          </div>
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
            <span className="text-white/40 block mb-2">Shipped Orders</span>
            <div className="text-3xl font-black text-ochi-green font-sans leading-none">{orders.filter(o => o.status?.toLowerCase() === 'shipped').length}</div>
          </div>
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
            <span className="text-white/40 block mb-2">Delivered Orders</span>
            <div className="text-3xl font-black text-emerald-400 font-sans leading-none">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</div>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 text-left">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <h3 className="text-white font-black uppercase text-lg">No Orders Logged</h3>
              <p className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">We couldn't find any checkout records matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono uppercase tracking-wider border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-bold text-[10px] tracking-widest">
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Purchased Items</th>
                    <th className="py-4 px-4">Total Amount</th>
                    <th className="py-4 px-4">Purchase Date</th>
                    <th className="py-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white/60">{o._id.toUpperCase()}</td>
                      <td className="py-4 px-4 font-sans normal-case">
                        <div className="font-bold text-white uppercase text-xs">{o.user?.name || "Deleted User"}</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">{o.shippingAddress?.email}</div>
                      </td>
                      <td className="py-4 px-4 font-sans normal-case text-white/60 text-xs">
                        <ul className="list-disc pl-4 space-y-0.5">
                          {o.items?.map((item, idx) => (
                            <li key={idx}>
                              <span className="uppercase font-bold">{item.product?.name || "Product"}</span> <span className="font-mono text-[10px] text-white/40">x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4 font-black text-white font-sans text-sm">${o.totalAmount}</td>
                      <td className="py-4 px-4 text-white/60">
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={o.status || "Pending"}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className={`text-[10px] font-mono font-bold rounded-full px-3 py-1.5 focus:outline-none border bg-[#212121] cursor-pointer ${
                            o.status?.toLowerCase() === 'delivered'
                              ? 'border-emerald-500/30 text-emerald-455'
                              : o.status?.toLowerCase() === 'shipped'
                              ? 'border-ochi-green/30 text-ochi-green'
                              : 'border-amber-500/30 text-amber-400'
                          }`}
                        >
                          <option value="Pending" className="bg-[#1C1C1C] text-amber-400">PENDING</option>
                          <option value="Shipped" className="bg-[#1C1C1C] text-ochi-green">SHIPPED</option>
                          <option value="Delivered" className="bg-[#1C1C1C] text-emerald-400">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default AdminOrders;
