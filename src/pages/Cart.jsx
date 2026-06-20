import { useSelector, useDispatch } from "react-redux";
import { deleteToCart, fetchCart } from "../redux/cartSlice";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  MapPin, 
  User, 
  Mail, 
  ChevronLeft,
  RotateCcw
} from "lucide-react";

function Cart() {
  useEffect(() => {
    document.title = 'Cart' 
  }, [])

  const { cartItems, isloading: isLoading, error } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  
  const [deletingId, setDeletingId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = shipping details, 2 = payment, 3 = order completed
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [paymentMethodSelection, setPaymentMethodSelection] = useState("razorpay");
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: ""
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    setDeletingId(productId);
    try {
      await dispatch(deleteToCart(productId)).unwrap();
      toast.success("Item removed from cart", {
        icon: '🗑️',
        style: {
          borderRadius: '9999px',
          background: '#1C1C1C',
          color: '#F1F1F1',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      });
    } catch (err) {
      toast.error(err || "Failed to remove item");
    } finally {
      setDeletingId(null);
    }
  };

  const subtotal = cartItems?.reduce((total, item) => total + (item.price || 0), 0) || 0;
  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.phoneNumber) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (paymentMethodSelection === "razorpay") {
      setIsProcessingOrder(true);
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load Razorpay SDK. Check your connection.");
          setIsProcessingOrder(false);
          return;
        }

        const keyRes = await fetch("/api/payment/key", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!keyRes.ok) throw new Error("Failed to load payment credentials");
        const { key } = await keyRes.json();

        const orderRes = await fetch("/api/payment/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ amount: grandTotal })
        });
        if (!orderRes.ok) throw new Error("Failed to initialize payment gateway");
        const rzpOrder = await orderRes.json();

        const options = {
          key: key,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "ShopNest",
          description: "Secure Checkout Payment",
          order_id: rzpOrder.id,
          prefill: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            contact: shippingInfo.phoneNumber
          },
          theme: {
            color: "#CDEA68"
          },
          handler: async (response) => {
            try {
              setIsProcessingOrder(true);
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed");

              const itemsMapped = cartItems.map(item => ({
                product: item._id,
                quantity: 1
              }));

              const dbOrderRes = await fetch("/api/order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  items: itemsMapped,
                  address: {
                    fullName: shippingInfo.fullName,
                    addressLine1: shippingInfo.address,
                    addressLine2: "",
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zipCode: shippingInfo.zipCode,
                    phoneNumber: shippingInfo.phoneNumber
                  },
                  totalAmount: grandTotal,
                  paymentMethod: "online",
                  status: "completed"
                })
              });

              const dbOrderData = await dbOrderRes.json();
              if (!dbOrderRes.ok) throw new Error(dbOrderData.message || "Failed to create order record");

              setGeneratedOrderId(dbOrderData.order?._id || dbOrderData.order?.id || "SN-SUCCESS");
              setCheckoutStep(3);
              toast.success("Payment successful! Order placed.");

              for (const item of cartItems) {
                await dispatch(deleteToCart(item._id)).unwrap();
              }
            } catch (err) {
              toast.error(err.message || "Order placement failed");
              console.error(err);
            } finally {
              setIsProcessingOrder(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessingOrder(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (err) {
        toast.error(err.message || "Payment initiation failed");
        console.error(err);
        setIsProcessingOrder(false);
      }
    } else {
      setIsProcessingOrder(true);
      try {
        const itemsMapped = cartItems.map(item => ({
          product: item._id,
          quantity: 1
        }));

        const dbOrderRes = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            items: itemsMapped,
            address: {
              fullName: shippingInfo.fullName,
              addressLine1: shippingInfo.address,
              addressLine2: "",
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
              phoneNumber: shippingInfo.phoneNumber
            },
            totalAmount: grandTotal,
            paymentMethod: "cashOnDelivery",
            status: "pending"
          })
        });

        const dbOrderData = await dbOrderRes.json();
        if (!dbOrderRes.ok) throw new Error(dbOrderData.message || "Failed to create order record");

        setGeneratedOrderId(dbOrderData.order?._id || dbOrderData.order?.id || "SN-SUCCESS");
        setCheckoutStep(3);
        toast.success("Order placed successfully! Cash on Delivery.");

        for (const item of cartItems) {
          await dispatch(deleteToCart(item._id)).unwrap();
        }
      } catch (err) {
        toast.error(err.message || "Order placement failed");
        console.error(err);
      } finally {
        setIsProcessingOrder(false);
      }
    }
  };

  const resetCheckoutState = () => {
    setShowCheckout(false);
    setCheckoutStep(1);
    setShippingInfo({ fullName: "", email: "", address: "", city: "", state: "", zipCode: "", phoneNumber: "" });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-ochi-charcoal flex items-center justify-center text-white px-4 border-t border-white/10">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/25 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Cart Error</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6">{error}</p>
          <button 
            onClick={() => dispatch(fetchCart())}
            className="px-6 py-3 border border-white/20 text-white rounded-full font-mono text-xs uppercase tracking-wider hover:border-white transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isInitialLoading = isLoading && (!cartItems || cartItems.length === 0);

  return (
    <div className="min-h-screen bg-ochi-charcoal text-[#F1F1F1] flex flex-col font-sans overflow-x-hidden relative border-t border-white/10">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full z-10 relative flex-1 flex flex-col justify-center">
        
        {isInitialLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center font-mono">
            <Loader2 className="h-10 w-10 text-ochi-green animate-spin mb-4" />
            <p className="text-white/50 text-xs uppercase tracking-widest">Syncing with secure vault...</p>
          </div>
        ) : cartItems && cartItems.length === 0 && checkoutStep !== 3 ? (
          
          /* --- EMPTY CART STATE --- */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 max-w-lg mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white bg-[#1C1C1C]">
                <ShoppingCart className="h-8 w-8 text-white/40" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-3 leading-none">
              Your Cargo is Empty
            </h1>
            <p className="text-white/60 text-xs font-mono uppercase tracking-wider mb-8 leading-relaxed max-w-xs">
              Your shopping cart is currently empty. Explore our catalog of designed essentials to fill it up.
            </p>
            <Link 
              to="/products"
              className="px-8 py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        ) : checkoutStep === 3 ? (
          
          /* --- ORDER SUCCESS SCREEN --- */
          <div className="max-w-2xl mx-auto w-full py-6">
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
              
              <div className="w-16 h-16 bg-ochi-green/10 border border-ochi-green/20 rounded-full flex items-center justify-center mx-auto mb-6 text-ochi-green">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase leading-none">
                Order Confirmed
              </h1>
              <p className="text-white/60 font-mono text-[10px] uppercase tracking-wider mb-8">Thank you for your purchase. Your invoice details are generated below.</p>
              
              <div className="border-t border-b border-white/10 py-6 mb-8 text-left space-y-4 font-mono text-xs uppercase tracking-wider text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/40">Order ID</span>
                  <span className="text-white font-bold">{generatedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Est. Delivery</span>
                  <span className="text-ochi-green font-bold">3-5 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Shipping to</span>
                  <span className="text-white text-right max-w-[250px] truncate">{shippingInfo.fullName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="text-white/40">Total Amount</span>
                  <span className="text-ochi-green font-black text-sm">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  to="/products"
                  onClick={resetCheckoutState}
                  className="w-full sm:w-1/2 py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
                <Link 
                  to="/orders"
                  onClick={resetCheckoutState}
                  className="w-full sm:w-1/2 py-4 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-all font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Order Logs</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : showCheckout ? (
          
          /* --- CHECKOUT DRAWER / FORM PROCESS --- */
          <div className="max-w-3xl mx-auto w-full py-4 text-left">
            <button 
              onClick={() => {
                if (checkoutStep === 2) setCheckoutStep(1);
                else setShowCheckout(false);
              }}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white mb-8 transition-colors font-mono uppercase tracking-wider cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back {checkoutStep === 2 ? 'to Shipping' : 'to Cart'}</span>
            </button>

            {/* Stepper progress indicator */}
            <div className="flex items-center justify-center gap-4 mb-10 max-w-xs mx-auto">
              <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${checkoutStep >= 1 ? 'text-ochi-green' : 'text-white/30'}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold ${checkoutStep >= 1 ? 'bg-ochi-green/10 border-ochi-green' : 'border-white/10'}`}>1</span>
                <span>Shipping</span>
              </div>
              <div className="h-px bg-white/10 flex-1"></div>
              <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${checkoutStep >= 2 ? 'text-ochi-green' : 'text-white/30'}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold ${checkoutStep >= 2 ? 'bg-ochi-green/10 border-ochi-green' : 'border-white/10'}`}>2</span>
                <span>Payment</span>
              </div>
            </div>

            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 md:p-10">
              {checkoutStep === 1 ? (
                /* STEP 1: SHIPPING DETAILS */
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h2 className="text-xl font-black text-white tracking-tight uppercase border-b border-white/10 pb-4 flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 text-ochi-green" />
                    <span>Shipping Address</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs uppercase tracking-wider">
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40">Full Name</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 h-4 w-4 text-white/30" />
                        <input 
                          type="text" 
                          placeholder="Anash Khan"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                          className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 pl-12 pr-4 font-mono text-xs placeholder-white/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40">Email Address</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 h-4 w-4 text-white/30" />
                        <input 
                          type="email" 
                          placeholder="anash@shopnest.com"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 pl-12 pr-4 font-mono text-xs placeholder-white/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
                    <label className="text-white/40">Street Address</label>
                    <input 
                      type="text" 
                      placeholder="123 Cosmic Way, Sector 5"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs uppercase tracking-wider">
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40">City</label>
                      <input 
                        type="text" 
                        placeholder="Mumbai"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40">State</label>
                      <input 
                        type="text" 
                        placeholder="Maharashtra"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40">ZIP Code</label>
                      <input 
                        type="text" 
                        placeholder="400001"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
                    <label className="text-white/40">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 9876543210"
                      value={shippingInfo.phoneNumber}
                      onChange={(e) => setShippingInfo({...shippingInfo, phoneNumber: e.target.value})}
                      className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 mt-6 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                /* STEP 2: PAYMENT METHOD */
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <h2 className="text-xl font-black text-white tracking-tight uppercase border-b border-white/10 pb-4 flex items-center gap-2.5">
                    <CreditCard className="h-5 w-5 text-ochi-green" />
                    <span>Select Payment Method</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => setPaymentMethodSelection("razorpay")}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                        paymentMethodSelection === "razorpay" 
                          ? "bg-ochi-green/5 border-ochi-green text-white" 
                          : "bg-[#212121]/40 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider font-bold">
                        <span>Razorpay Online</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethodSelection === "razorpay" ? "border-ochi-green" : "border-white/20"
                        }`}>
                          {paymentMethodSelection === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-ochi-green"></div>}
                        </div>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed font-mono uppercase tracking-wider">
                        Pay securely using Credit/Debit Cards, UPI, Net Banking, or popular Mobile Wallets.
                      </p>
                    </div>

                    <div 
                      onClick={() => setPaymentMethodSelection("cashOnDelivery")}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                        paymentMethodSelection === "cashOnDelivery" 
                          ? "bg-ochi-green/5 border-ochi-green text-white" 
                          : "bg-[#212121]/40 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider font-bold">
                        <span>Cash on Delivery</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethodSelection === "cashOnDelivery" ? "border-ochi-green" : "border-white/20"
                        }`}>
                          {paymentMethodSelection === "cashOnDelivery" && <div className="w-2.5 h-2.5 rounded-full bg-ochi-green"></div>}
                        </div>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed font-mono uppercase tracking-wider">
                        Pay with cash upon delivery of your cosmic essentials. Estimated delivery 3-5 days.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessingOrder}
                    className="w-full py-4 mt-8 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal disabled:bg-white/10 disabled:text-white/20 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-ochi-charcoal" />
                        <span>Processing Order...</span>
                      </>
                    ) : paymentMethodSelection === "razorpay" ? (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Pay via Razorpay (${grandTotal.toFixed(2)})</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Place Cash on Delivery Order (${grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          
          /* --- REGULAR SHOPPING CART TABLE --- */
          <div className="w-full text-left">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-10 gap-4">
              <div>
                <span className="font-mono text-xs text-ochi-green uppercase tracking-widest block mb-2">
                  Inventory Release
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                  Shopping Cart
                </h1>
              </div>
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                Selected release cargo: {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Product Rows Column */}
              <div className="lg:col-span-8">
                {/* Table Header labels */}
                <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-white/10 pb-4 mb-4 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  <div className="col-span-8">Item Detail</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="divide-y divide-white/10 border-b border-white/10">
                  {cartItems.map((cart) => (
                    <div 
                      key={cart._id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-6 items-center"
                    >
                      {/* Image & Title details */}
                      <div className="col-span-1 sm:col-span-8 flex items-center gap-4">
                        <Link 
                          to={`/product/${cart._id}`}
                          className="w-20 h-20 rounded-xl bg-[#262626] border border-white/5 overflow-hidden shrink-0 block relative group"
                        >
                          <img 
                            src={cart.image_url} 
                            alt={cart.name} 
                            className="object-cover w-full h-full transform group-hover:scale-102 transition-transform duration-500"
                          />
                        </Link>
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">
                            <span>{cart.brand}</span>
                            <span>/</span>
                            <span className="text-ochi-green">{cart.category}</span>
                          </div>
                          <Link to={`/product/${cart._id}`} className="block">
                            <h3 className="text-base font-black text-white hover:text-ochi-green transition-colors uppercase tracking-tight leading-tight line-clamp-1">
                              {cart.name}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      {/* Price info */}
                      <div className="col-span-1 sm:col-span-2 text-left sm:text-right font-mono">
                        <span className="text-[10px] text-white/30 uppercase tracking-wider block sm:hidden">Price</span>
                        <span className="text-base sm:text-lg font-black text-white">${cart.price}</span>
                      </div>

                      {/* Remove control */}
                      <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-end">
                        <button 
                          onClick={() => handleRemove(cart._id)}
                          disabled={deletingId !== null}
                          className="px-3.5 py-1.5 rounded-full border border-white/15 hover:border-rose-500/30 hover:bg-rose-500/10 text-white/70 hover:text-rose-400 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50"
                          title="Remove item"
                        >
                          {deletingId === cart._id ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Deleting</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 md:p-8">
                  <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">
                    Bill Calculation
                  </h2>

                  {/* Free shipping goal bar */}
                  {shippingCost > 0 && (
                    <div className="mb-6 p-4 border border-white/10 rounded-xl bg-white/5">
                      <div className="flex justify-between font-mono text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                        <span>Free Shipping Progress</span>
                        <span>{((subtotal / shippingThreshold) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-[#212121] rounded-full h-1 overflow-hidden border border-white/5">
                        <div 
                          className="bg-ochi-green h-full rounded-full transition-all duration-500" 
                          style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                        ></div>
                      </div>
                      <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-2">
                        Add <span className="text-white font-bold">${(shippingThreshold - subtotal).toFixed(2)}</span> more for FREE delivery
                      </p>
                    </div>
                  )}

                  {shippingCost === 0 && subtotal > 0 && (
                    <div className="mb-6 p-3 bg-ochi-green/10 border border-ochi-green/20 rounded-xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ochi-green animate-pulse shrink-0"></span>
                      <span className="font-mono text-[9px] font-bold text-ochi-green uppercase tracking-widest">
                        Complementary delivery applied
                      </span>
                    </div>
                  )}

                  <div className="space-y-4 font-mono text-xs uppercase tracking-wider text-white/60">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipping Fee</span>
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
                      <span className="text-3xl font-black text-ochi-green font-sans leading-none">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-4 mt-8 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Order</span>
                    <ArrowRight className="h-4 w-4 text-ochi-charcoal group-hover:translate-x-1" />
                  </button>

                  <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/10 font-mono text-[9px] uppercase tracking-wider text-white/35">
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-ochi-green" />
                      <span>Encrypted Payment</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <Truck className="h-4 w-4 text-ochi-green" />
                      <span>Insured Transit</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <RotateCcw className="h-4 w-4 text-ochi-green" />
                      <span>Simple Returns</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;
