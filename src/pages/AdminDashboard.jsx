import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Search
} from "lucide-react";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const token = localStorage.getItem("token");

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const analyticsRes = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const analyticsData = await analyticsRes.json();

      const productsRes = await fetch('/api/product');
      const productsData = await productsRes.json();

      const ordersRes = await fetch('/api/order', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const ordersData = await ordersRes.json();

      const usersRes = await fetch('/api/admin/alluser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersRes.json();

      if (analyticsRes.ok) setAnalytics(analyticsData);
      if (productsRes.ok) setProducts(productsData.products || []);
      if (ordersRes.ok) setOrders(ordersData.orders || []);
      if (usersRes.ok) setUsers(usersData.User || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Dashboard | ShopNest';
    if (token) {
      loadData();
    } else {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "Are you sure you want to permanently delete this product from the catalog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#212121",
      color: "#F1F1F1",
      customClass: {
        popup: "border border-white/10 rounded-2xl shadow-2xl bg-[#212121] p-8 font-sans text-center",
        title: "text-lg font-black text-white tracking-tight uppercase mb-2",
        htmlContainer: "text-white/60 text-xs font-mono uppercase tracking-wider leading-relaxed mb-6",
        confirmButton: "px-5 py-2 rounded-full bg-rose-650 hover:bg-rose-500 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200",
        cancelButton: "px-5 py-2 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200 mr-3"
      }
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/product/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: productId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p._id !== productId));
      setAnalytics(prev => prev ? { ...prev, totalproducts: Math.max(0, prev.totalproducts - 1) } : null);
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o._id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.status?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center pt-20 border-t border-white/10">
        <Loader2 className="h-10 w-10 animate-spin text-ochi-green mb-4" />
        <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Syncing admin dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center px-4 pt-20 border-t border-white/10">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Access Denied</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6 leading-relaxed">{error}</p>
          <button onClick={loadData} className="px-6 py-3 border border-white/20 text-white rounded-full font-mono font-bold transition-all text-xs uppercase tracking-wider cursor-pointer w-full">
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full">
        
        {/* Header Block */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4 text-left">
          <div>
            <span className="font-mono text-xs text-ochi-green uppercase tracking-widest block mb-2">
              Control Operations
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Admin Panel
            </h1>
          </div>
          <p className="font-mono text-xs text-white/45 uppercase tracking-wider max-w-sm leading-relaxed">
            Monitor real-time sales revenue, manage users profiles, edit inventory listings, and update checkout orders.
          </p>
        </header>

        {/* Tab Controls */}
        <nav className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-6 text-left">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "products", label: "Products", icon: ShoppingBag },
            { id: "orders", label: "Orders", icon: ClipboardList },
            { id: "users", label: "Users", icon: Users }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-ochi-green border-ochi-green text-ochi-charcoal"
                    : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <section className="min-h-[50vh] text-left">
          
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Revenue",
                    value: `$${analytics?.totalRevenue?.toLocaleString() || "0"}`,
                    icon: DollarSign,
                    color: "text-ochi-green"
                  },
                  {
                    title: "Total Orders",
                    value: analytics?.totalorders || "0",
                    icon: ClipboardList,
                    color: "text-white"
                  },
                  {
                    title: "Total Products",
                    value: analytics?.totalproducts || "0",
                    icon: ShoppingBag,
                    color: "text-white"
                  },
                  {
                    title: "Registered Users",
                    value: analytics?.totalUsers || "0",
                    icon: Users,
                    color: "text-white"
                  }
                ].map((card, idx) => {
                  return (
                    <div
                      key={idx}
                      className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 flex items-center justify-between group"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">{card.title}</span>
                        <div className="text-3xl font-black text-white leading-none font-sans">{card.value}</div>
                      </div>
                      <div className={`w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center ${card.color}`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphic Chart + Activity row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Sales Chart */}
                <div className="lg:col-span-8 bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-ochi-green" />
                        <span>Sales Revenue Trends</span>
                      </h3>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Analytics overview of weekly transactions</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ochi-green bg-ochi-green/10 border border-ochi-green/20 px-3 py-1 rounded-full">+18.5% THIS WEEK</span>
                  </div>

                  {/* SVG Chart Wave */}
                  <div className="relative">
                    <svg className="w-full h-48 md:h-64 mt-4 overflow-visible" viewBox="0 0 700 250">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#CDEA68" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="#CDEA68" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <line x1="50" y1="50" x2="650" y2="50" stroke="currentColor" className="text-white/5" strokeDasharray="4 4" />
                      <line x1="50" y1="100" x2="650" y2="100" stroke="currentColor" className="text-white/5" strokeDasharray="4 4" />
                      <line x1="50" y1="150" x2="650" y2="150" stroke="currentColor" className="text-white/5" strokeDasharray="4 4" />
                      <line x1="50" y1="200" x2="650" y2="200" stroke="currentColor" className="text-white/5" strokeDasharray="4 4" />
                      <path
                        d="M 50 180 C 100 160, 100 140, 150 140 C 200 140, 200 160, 250 160 C 300 160, 300 100, 350 100 C 400 100, 400 110, 450 110 C 500 110, 500 60, 550 60 C 600 60, 600 40, 650 40"
                        fill="none"
                        stroke="#CDEA68"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50 180 C 100 160, 100 140, 150 140 C 200 140, 200 160, 250 160 C 300 160, 300 100, 350 100 C 400 100, 400 110, 450 110 C 500 110, 500 60, 550 60 C 600 60, 600 40, 650 40 L 650 200 L 50 200 Z"
                        fill="url(#chartGlow)"
                      />
                      <circle cx="50" cy="180" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <circle cx="150" cy="140" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <circle cx="250" cy="160" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <circle cx="350" cy="100" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <circle cx="450" cy="110" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <circle cx="550" cy="60" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <circle cx="650" cy="40" r="4.5" fill="#CDEA68" stroke="currentColor" className="text-black" strokeWidth="2" />
                      <text x="50" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">MON</text>
                      <text x="150" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">TUE</text>
                      <text x="250" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">WED</text>
                      <text x="350" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">THU</text>
                      <text x="450" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">FRI</text>
                      <text x="550" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">SAT</text>
                      <text x="650" y="230" fill="currentColor" className="text-white/40" fontSize="10" fontFamily="Space Mono" textAnchor="middle">SUN</text>
                    </svg>
                  </div>
                </div>

                {/* Shortcuts & Stats */}
                <div className="lg:col-span-4 bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">Shortcut Panel</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-4">Quick access to admin modules</p>
                    <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
                      <Link
                        to="/admin/add-product"
                        className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-ochi-green text-white hover:text-ochi-green transition-all duration-300 font-bold group"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Create Product
                        </span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <button
                        onClick={() => setActiveTab("products")}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-transparent hover:border-ochi-green text-white hover:text-ochi-green transition-all duration-300 font-bold group cursor-pointer text-left w-full"
                      >
                        <span>Products Inventory ({products.length})</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-transparent hover:border-ochi-green text-white hover:text-ochi-green transition-all duration-300 font-bold group cursor-pointer text-left w-full"
                      >
                        <span>Orders pipeline ({orders.length})</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-3">Order distribution</span>
                    <div className="grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-wider">
                      <div className="text-center p-3 border border-white/5 rounded-xl bg-[#212121]">
                        <div className="text-lg font-black text-amber-400">{orders.filter(o => o.status?.toLowerCase() === 'pending').length}</div>
                        <div className="text-white/40 mt-1">Pending</div>
                      </div>
                      <div className="text-center p-3 border border-white/5 rounded-xl bg-[#212121]">
                        <div className="text-lg font-black text-ochi-green">{orders.filter(o => o.status?.toLowerCase() === 'shipped').length}</div>
                        <div className="text-white/40 mt-1">Shipped</div>
                      </div>
                      <div className="text-center p-3 border border-white/5 rounded-xl bg-[#212121]">
                        <div className="text-lg font-black text-emerald-400">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</div>
                        <div className="text-white/40 mt-1">Delivered</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= PRODUCTS TAB ================= */}
          {activeTab === "products" && (
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search product name, brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#212121] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:border-ochi-green outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                </div>
                <Link
                  to="/admin/add-product"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-10 w-10 text-white/20 mx-auto mb-3" />
                  <h3 className="text-white font-black uppercase text-lg">No Products Found</h3>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">Try refining your search keyword.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono uppercase tracking-wider border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-bold text-[10px] tracking-widest">
                        <th className="py-4 px-4">Product Info</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Price</th>
                        <th className="py-4 px-4">Stock</th>
                        <th className="py-4 px-4">Rating</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 normal-case font-sans">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url} alt={p.name} className="h-10 w-10 object-cover rounded-lg border border-white/5" />
                              <div>
                                <div className="font-bold text-white uppercase font-sans text-sm">{p.name}</div>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{p.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-white/70">{p.category}</td>
                          <td className="py-4 px-4 font-black text-white font-sans text-sm">${p.price}</td>
                          <td className="py-4 px-4 font-bold">
                            {p.stock === 0 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-rose-500/20 bg-rose-500/10 text-rose-400">OUT</span>
                            ) : p.stock <= 5 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-amber-500/20 bg-amber-500/10 text-amber-400">{p.stock} LOW</span>
                            ) : (
                              <span className="text-white/60">{p.stock} UNITS</span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-ochi-green">{p.rating} ★</td>
                          <td className="py-4 px-4 text-right font-sans">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/add-product?editing=true&id=${p._id}`}
                                className="px-3 py-1.5 rounded-full border border-white/10 hover:border-ochi-green hover:text-ochi-green font-mono text-[9px] uppercase tracking-wider transition-all"
                              >
                                <SlidersHorizontal className="h-3 w-3 inline mr-1" />
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="px-3 py-1.5 rounded-full border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3 inline mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center pb-4 border-b border-white/5">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by ID, customer name..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-[#212121] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:border-ochi-green outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-10 w-10 text-white/20 mx-auto mb-3" />
                  <h3 className="text-white font-black uppercase text-lg">No Orders Logged</h3>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">Try adjusting your search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono uppercase tracking-wider border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-bold text-[10px] tracking-widest">
                        <th className="py-4 px-4">Order ID</th>
                        <th className="py-4 px-4">Customer</th>
                        <th className="py-4 px-4">Details</th>
                        <th className="py-4 px-4">Total Amount</th>
                        <th className="py-4 px-4">Order Date</th>
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
                                  ? 'border-emerald-500/30 text-emerald-405'
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
          )}

          {/* ================= USERS TAB ================= */}
          {activeTab === "users" && (
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center pb-4 border-b border-white/5">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-[#212121] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:border-ochi-green outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-10 w-10 text-white/20 mx-auto mb-3" />
                  <h3 className="text-white font-black uppercase text-lg">No Users Registered</h3>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">Try searching with other fields.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono uppercase tracking-wider border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-bold text-[10px] tracking-widest">
                        <th className="py-4 px-4">User Name</th>
                        <th className="py-4 px-4">Email Address</th>
                        <th className="py-4 px-4">Role</th>
                        <th className="py-4 px-4">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                          <td className="py-4 px-4 text-white/60 font-semibold lowercase break-all">{u.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                              u.role?.toLowerCase() === 'admin'
                                ? 'border-ochi-green/30 bg-ochi-green/10 text-ochi-green'
                                : 'border-white/10 bg-white/5 text-white/50'
                            }`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {u.isVerified ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase inline-flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> VERIFIED
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-rose-500/20 bg-rose-500/10 text-rose-455 uppercase inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> PENDING
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminDashboard;