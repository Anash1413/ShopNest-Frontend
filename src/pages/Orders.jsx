import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ClipboardList, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  ShoppingBag,
  Calendar,
  CreditCard
} from 'lucide-react'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/order/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to load orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'My Orders | ShopNest'
    if (token) {
      fetchOrders()
    } else {
      setError('Please log in to view your orders.')
      setLoading(false)
    }
  }, [token])

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full">
        
        {/* Back navigation */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-ochi-green transition-colors font-mono uppercase tracking-wider cursor-pointer group mb-8"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>

        {/* Page Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4 text-left">
          <div>
            <span className="font-mono text-xs text-ochi-green uppercase tracking-widest block mb-2">
              Purchase History
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Order Logs
            </h1>
          </div>
          <p className="font-mono text-xs text-white/45 uppercase tracking-wider max-w-sm leading-relaxed">
            Verify shipment updates, view invoices, and browse details of your previous orders.
          </p>
        </header>

        {/* Main Content */}
        <div className="w-full text-left">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 font-mono">
              <Loader2 className="h-8 w-8 text-ochi-green animate-spin" />
              <span className="text-white/40 text-xs uppercase tracking-widest">Syncing order records...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-white/10 rounded-2xl bg-[#1C1C1C] p-8 max-w-lg mx-auto">
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
              <h3 className="text-rose-450 font-black uppercase tracking-tight text-lg mb-2">Error Syncing Logs</h3>
              <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6">{error}</p>
              <button 
                onClick={fetchOrders}
                className="px-6 py-3 border border-white/20 hover:bg-white hover:text-ochi-charcoal text-white rounded-full font-mono font-bold transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Retry Fetch
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border border-white/10 rounded-2xl bg-[#1C1C1C] p-8 max-w-lg mx-auto flex flex-col items-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/30">
                  <ClipboardList className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-white font-black uppercase tracking-tight text-xl mb-2">No Cargo Released</h3>
              <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-8 max-w-xs leading-relaxed">
                Your order logs are empty. Visit the store, add items to your cart, and complete checkouts.
              </p>
              <Link 
                to="/products"
                className="px-8 py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order._id}
                  className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-ochi-green/30 transition-all duration-300 group"
                >
                  <div className="flex-1 space-y-4 w-full">
                    {/* Top Row: Order metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Order Identifier</span>
                        <span className="font-mono text-xs text-white font-bold">{order._id.toUpperCase()}</span>
                      </div>
                      
                      <div className="flex gap-6 font-mono text-xs uppercase tracking-wider text-white/50">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-ochi-green" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-ochi-green" />
                          <span>{order.paymentMethod === 'online' ? 'Online Gateway' : 'COD'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">Transit Status</span>
                        <span className={`text-[9px] font-mono font-bold rounded-full px-3 py-1 border uppercase tracking-wider ${
                          order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : order.status?.toLowerCase() === 'shipped'
                            ? 'bg-ochi-green/10 border-ochi-green/30 text-ochi-green'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Items preview */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#212121] border border-white/5 p-3 rounded-xl">
                          <img 
                            src={item.product?.image_url} 
                            alt={item.product?.name} 
                            className="w-10 h-10 object-cover rounded-lg border border-white/5 shrink-0" 
                          />
                          <div className="text-left font-mono text-[10px] uppercase tracking-wider">
                            <span className="font-bold text-white block max-w-[120px] truncate">{item.product?.name}</span>
                            <span className="text-white/40">{item.product?.brand} x{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Total Paid + Detail Link */}
                  <div className="flex flex-col items-end justify-between md:border-l border-white/5 md:pl-6 md:min-w-[150px] w-full md:w-auto self-stretch gap-4 md:gap-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-left md:text-right w-full">
                      <span className="text-[10px] font-mono text-white/40 block uppercase tracking-widest mb-1">Grand Total</span>
                      <span className="text-2xl font-black text-ochi-green font-sans leading-none">${order.totalAmount}</span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex w-full md:w-fit items-center justify-center gap-1.5 rounded-full border border-white/15 hover:border-white hover:bg-white/5 px-5 py-2.5 text-xs font-mono font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>Invoice details</span>
                      <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders;