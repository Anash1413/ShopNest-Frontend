import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Calendar,
  User,
  Mail,
  SlidersHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'

function AdminOrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/order/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Order details could not be found')
      const data = await res.json()
      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Admin Order Details | ShopNest'
    if (token) {
      fetchOrderDetails()
    } else {
      setError('Please log in as admin.')
      setLoading(false)
    }
  }, [id, token])

  const handleUpdateOrderStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/order/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ _id: order._id, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      toast.success("Order status updated successfully");
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center pt-20 border-t border-white/10">
        <Loader2 className="h-10 w-10 animate-spin text-ochi-green mb-4" />
        <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Syncing order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center px-4 pt-20 border-t border-white/10">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Error Loading</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6 leading-relaxed">{error || "Order data missing"}</p>
          <Link to="/admin/orders" className="px-6 py-3 border border-white/20 text-white rounded-full font-mono text-xs uppercase tracking-wider hover:border-white transition-all block w-full">
            Back to Orders Log
          </Link>
        </div>
      </div>
    )
  }

  const itemsSubtotal = order.items?.reduce((total, item) => total + ((item.product?.price || 0) * (item.quantity || 1)), 0) || 0;
  const shippingThreshold = 100;
  const shippingCost = itemsSubtotal >= shippingThreshold || itemsSubtotal === 0 ? 0 : 15;
  const estimatedTax = itemsSubtotal * 0.08;

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full space-y-8">
        
        {/* Navigation */}
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-ochi-green transition-colors font-mono uppercase tracking-wider cursor-pointer group mb-4"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Orders Log</span>
        </Link>

        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4 text-left">
          <div>
            <span className="font-mono text-xs text-ochi-green uppercase tracking-widest block mb-2">
              Operations Inspector
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Inspect Order
            </h1>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end font-mono text-xs uppercase tracking-wider">
            <span className="text-white/40 tracking-widest block">Modify Shipment Status</span>
            <select
              value={order.status || "Pending"}
              onChange={(e) => handleUpdateOrderStatus(e.target.value)}
              className={`text-[10px] font-mono font-bold rounded-full px-3 py-1.5 focus:outline-none border bg-[#212121] cursor-pointer ${
                order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered'
                  ? 'border-emerald-500/30 text-emerald-455'
                  : order.status?.toLowerCase() === 'shipped'
                  ? 'border-ochi-green/30 text-ochi-green'
                  : 'border-amber-500/30 text-amber-400'
              }`}
            >
              <option value="pending" className="bg-[#1C1C1C] text-amber-400">PENDING</option>
              <option value="shipped" className="bg-[#1C1C1C] text-ochi-green">SHIPPED</option>
              <option value="completed" className="bg-[#1C1C1C] text-emerald-400">DELIVERED</option>
            </select>
          </div>
        </header>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
          
          {/* LEFT: Items Table & Customer Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Customer Details Box */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1 font-mono text-xs uppercase tracking-wider text-white/70">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Customer Profiles</span>
                <div className="font-bold text-white text-sm flex items-center gap-1.5 font-sans normal-case">
                  <User className="h-4 w-4 text-ochi-green" />
                  <span className="uppercase font-mono text-xs">{order.user?.name || "Deleted User"}</span>
                </div>
                <div className="text-[11px] text-white/50 flex items-center gap-1.5 font-sans normal-case font-bold">
                  <Mail className="h-3.5 w-3.5 text-ochi-green" />
                  <span className="font-mono text-[11px] text-white/50 lowercase">{order.user?.email || "No email info"}</span>
                </div>
              </div>

              <div className="flex gap-6 font-mono text-xs uppercase tracking-wider text-white/50">
                <div>
                  <span className="text-[10px] text-white/40 tracking-widest block mb-1">Receipt Date</span>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Calendar className="h-4 w-4 text-ochi-green" />
                    <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-white/40 tracking-widest block mb-1">Payment Method</span>
                  <div className="flex items-center gap-1.5 font-bold text-ochi-green">
                    <CreditCard className="h-4 w-4 text-ochi-green" />
                    <span>{order.paymentMethod === 'online' ? 'Online' : 'COD'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table List */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4 mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-ochi-green" />
                <span>Cargo Release Details</span>
              </h2>

              <div className="divide-y divide-white/5">
                {order.items?.map((item) => (
                  <div key={item.product?._id} className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img 
                        src={item.product?.image_url} 
                        alt={item.product?.name} 
                        className="w-16 h-16 object-cover rounded-xl border border-white/5 shrink-0" 
                      />
                      <div>
                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block mb-1">
                          {item.product?.brand} · {item.product?.category}
                        </span>
                        <h3 className="text-base font-black text-white uppercase leading-none tracking-tight">{item.product?.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-white/5 font-mono text-xs uppercase tracking-wider text-white/70">
                      <div className="text-left sm:text-right sm:min-w-[80px]">
                        <span className="text-[9px] text-white/30 block">Price</span>
                        <span className="font-bold text-white">${item.product?.price}</span>
                      </div>
                      <div className="text-left sm:text-right sm:min-w-[50px]">
                        <span className="text-[9px] text-white/30 block">Qty</span>
                        <span className="font-bold text-white">x{item.quantity}</span>
                      </div>
                      <div className="text-left sm:text-right sm:min-w-[85px]">
                        <span className="text-[9px] text-white/30 block">Subtotal</span>
                        <span className="font-bold text-white">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Address & Financial Summaries */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Delivery Details Card */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-ochi-green" />
                <span>Shipping Location</span>
              </h2>
              <div className="space-y-4 font-mono text-xs uppercase tracking-wider text-white/70">
                <div>
                  <span className="text-[9px] text-white/30 block mb-1">Recipient Name</span>
                  <span className="text-white font-bold">{order.address?.fullName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/30 block mb-1">Street Address</span>
                  <span className="text-white font-bold">{order.address?.addressLine1} {order.address?.addressLine2}</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/30 block mb-1">City / Region</span>
                  <span className="text-white font-bold">{order.address?.city}, {order.address?.state} - {order.address?.zipCode}</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/30 block mb-1">Contact Dial</span>
                  <span className="text-white font-bold">{order.address?.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Financial Invoice Details */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-ochi-green" />
                <span>Billing Balance</span>
              </h2>
              <div className="space-y-4 font-mono text-xs uppercase tracking-wider text-white/60">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-white font-bold">${itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transit Fee</span>
                  {shippingCost === 0 ? (
                    <span className="text-ochi-green font-bold text-[10px] uppercase border border-ochi-green/30 px-2 py-0.5 rounded-full bg-ochi-green/10">Free</span>
                  ) : (
                    <span className="text-white font-bold">${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white font-bold">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-5 mt-5 flex justify-between items-end">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">Grand Total</span>
                  <span className="text-2xl font-black text-ochi-green font-sans leading-none">${order.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminOrderDetails;
