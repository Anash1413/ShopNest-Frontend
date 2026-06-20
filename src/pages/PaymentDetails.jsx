import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Printer,
  Calendar,
  Lock
} from 'lucide-react'

function PaymentDetails() {
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
      if (!res.ok) throw new Error('Payment ledger details could not be found')
      const data = await res.json()
      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Payment Details | ShopNest'
    if (token) {
      fetchOrderDetails()
    } else {
      setError('Please log in to view payment logs.')
      setLoading(false)
    }
  }, [id, token])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center pt-20 border-t border-white/10">
        <Loader2 className="h-10 w-10 animate-spin text-ochi-green mb-4" />
        <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Syncing payment records...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-ochi-charcoal text-white flex flex-col items-center justify-center px-4 pt-20 border-t border-white/10">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Receipt Missing</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6 leading-relaxed">{error || "Payment data is missing"}</p>
          <Link to="/orders" className="px-6 py-3 border border-white/20 text-white rounded-full font-mono text-xs uppercase tracking-wider hover:border-white transition-all block w-full">
            Back to Orders Log
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10 print:bg-white print:text-black">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full space-y-8">
        
        {/* Navigation */}
        <Link
          to={`/orders/${order._id}`}
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-ochi-green transition-colors font-mono uppercase tracking-wider cursor-pointer group mb-4 print:hidden"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Order Details</span>
        </Link>

        {/* Invoice Container */}
        <div className="max-w-2xl mx-auto bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 text-left print:bg-transparent print:border-none print:shadow-none">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4 border-b border-white/10 pb-8">
            <div className="w-12 h-12 bg-ochi-green/10 border border-ochi-green/20 rounded-full flex items-center justify-center text-ochi-green">
              <CheckCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none print:text-black">Payment Receipt</h1>
              <p className="text-xs text-white/40 font-mono uppercase tracking-widest">ORDER: {order._id.toUpperCase()}</p>
            </div>

            <div className="px-3.5 py-1.5 bg-[#212121] border border-white/5 rounded-full inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-white/70 print:bg-slate-100 print:text-black print:border-slate-200">
              <Calendar className="h-4 w-4 text-ochi-green" />
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-8 space-y-6 text-sm text-white/70">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2 print:text-black">Transaction Metadata</h2>
            
            <div className="space-y-4 font-mono text-xs uppercase tracking-wider text-white/60">
              <div className="flex justify-between">
                <span>Customer</span>
                <span className="text-white font-bold print:text-black">{order.address?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Phone</span>
                <span className="text-white font-bold print:text-black">{order.address?.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-ochi-green font-bold">{order.paymentMethod === 'online' ? 'Online (Razorpay)' : 'COD'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-4">
                <span>Status</span>
                <span className="text-emerald-400 font-bold">SUCCESS / VERIFIED</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 font-mono text-xs uppercase tracking-wider">
              {order.items?.map((item) => (
                <div key={item.product?._id} className="flex justify-between text-white/40 print:text-black">
                  <span className="max-w-[300px] truncate">{item.product?.name} x{item.quantity}</span>
                  <span className="text-white font-bold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-white/40 items-end">
                <span>Amount Paid</span>
                <span className="text-3xl font-black text-ochi-green font-sans leading-none">${order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10 print:hidden">
            <button 
              onClick={handlePrint}
              className="w-full py-4 rounded-full border border-white/20 hover:border-white text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Secure indicator */}
          <div className="mt-6 text-center flex items-center justify-center gap-1.5 font-mono text-[9px] text-white/30 uppercase tracking-widest print:hidden">
            <Lock className="h-3.5 w-3.5 text-ochi-green" />
            <span>Secure Encryption Gateway</span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default PaymentDetails;