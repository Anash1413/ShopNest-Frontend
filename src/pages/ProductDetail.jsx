import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Package,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Tag,
  Check,
  SlidersHorizontal,
  Loader2,
  Trash2
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import ProductCard from '../components/ProductCard'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAdmin } = useAuth()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavourite, setIsFavourite] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        document.title = 'Product-Details'

        const res = await fetch(`/api/product/detail/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        if (data && data.product) {
          setProduct(data.product)
          
          // Sync with backend favourites
          const token = localStorage.getItem("token")
          if (token) {
            const favRes = await fetch("/api/favourites", {
              headers: { "Authorization": `Bearer ${token}` }
            })
            if (favRes.ok) {
              const favData = await favRes.json()
              const isFav = favData.favourites?.some(item => item._id === data.product._id)
              setIsFavourite(!!isFav)
            }
          }
        } else {
          throw new Error('Product not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await dispatch(addToCart(product._id)).unwrap()
      toast.success('Item added to cart')
      if (cartItems.includes(product._id)) {
        setCartItems(cartItems.filter(item => item !== product._id))
      } else {
        setCartItems([...cartItems, product._id])
      }
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

  const handleToggleFavourite = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to save favourites")
      return
    }
    try {
      const method = isFavourite ? "DELETE" : "POST"
      const res = await fetch("/api/favourites", {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      })
      if (!res.ok) throw new Error("Failed to update wishlist")
      setIsFavourite(!isFavourite)
      toast.success(isFavourite ? 'Removed from saved items' : 'Saved to favourites', {
        icon: isFavourite ? '🗑️' : '❤️',
        style: {
          borderRadius: '9999px',
          background: '#1C1C1C',
          color: '#F1F1F1',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      })
    } catch (err) {
      toast.error(err.message || "Could not update saved items")
    }
  }

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Product Profile?",
      text: "This operation will permanently erase this product record from the ShopNest catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
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

    setIsDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/product/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: product._id })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (err) {
      toast.error("Error deleting product: " + err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  // Star rendering helper
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.floor(rating)
              ? 'text-ochi-green fill-ochi-green'
              : i - 0.5 <= rating
              ? 'text-ochi-green fill-ochi-green/50'
              : 'text-white/20'
          }`}
        />
      )
    }
    return stars
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ochi-charcoal flex items-center justify-center text-white">
        <div className="text-center font-mono">
          <Loader2 className="h-10 w-10 text-ochi-green animate-spin mb-4 mx-auto" />
          <p className="text-white/50 text-xs uppercase tracking-widest">Fetching release specs...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ochi-charcoal flex items-center justify-center text-white px-4">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Record Mismatch</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6">{error || 'Product data files missing.'}</p>
          <Link to="/products" className="px-6 py-3 bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal rounded-full font-mono font-bold text-xs uppercase tracking-wider transition-all block">
            Return to Release Grid
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto">
        
        {/* --- Back Nav --- */}
        <nav className="w-full px-6 py-8 md:px-12 flex justify-between items-center border-b border-white/10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-ochi-green transition-colors font-mono uppercase tracking-wider cursor-pointer group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
          <span className="font-mono text-xs text-white/30 uppercase tracking-widest">
            SKU: {product._id.slice(-6).toUpperCase()}
          </span>
        </nav>

        {/* --- Main Product Section --- */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          
          {/* ======= LEFT: Product Image ======= */}
          <div className="lg:col-span-6 p-6 md:p-12 flex items-center justify-center bg-[#1C1C1C] lg:border-r border-white/10">
            <div className="relative w-full aspect-square bg-[#262626] border border-white/5 rounded-2xl overflow-hidden group">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
              />

              {/* Rating Pill */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white">
                <Star className="h-3 w-3 text-ochi-green fill-ochi-green" />
                <span>{product.rating || "4.5"}</span>
                <span className="text-white/30">({product.numReviews || "0"})</span>
              </div>

              {/* Favorite Heart Button */}
              <button
                onClick={handleToggleFavourite}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 cursor-pointer active:scale-90 ${
                  isFavourite
                    ? 'bg-rose-500/20 border-rose-500/40'
                    : 'bg-black/50 border-white/10 hover:bg-white/10'
                }`}
                title={isFavourite ? 'Remove from saved' : 'Save to favourites'}
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-300 ${
                    isFavourite
                      ? 'text-rose-500 fill-rose-500 scale-110'
                      : 'text-white/70'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ======= RIGHT: Product Info ======= */}
          <div className="lg:col-span-6 p-6 md:p-12 flex flex-col justify-between">
            <div>
              {/* Brand & Category badges */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 rounded-full text-white/70">
                  {product.brand}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 rounded-full text-ochi-green">
                  <Tag className="h-2.5 w-2.5" />
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none mb-4">
                {product.name}
              </h1>

              {/* Stars & rating summary */}
              <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-0.5">
                  {renderStars(product.rating || 4.5)}
                </div>
                <span className="text-xs font-mono text-white/60 ml-2">
                  {product.rating || "4.5"} ({product.numReviews || "0"} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-extrabold text-ochi-green tracking-tight font-sans">
                  ${product.price}
                </span>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Free Delivery Enabled
                </span>
              </div>

              {/* Details grid styled like Ochi's minimal list / invoices */}
              <div className="border-t border-white/10 mb-8 font-mono text-xs uppercase tracking-wider">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Status</span>
                  <span className={`font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {product.stock > 0 ? `Available (${product.stock} Units)` : 'Unavailable / Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Ship Time</span>
                  <span className="text-white/80">Ships in 2-3 Business Days</span>
                </div>
                <div className="py-4 border-b border-white/5">
                  <span className="text-white/40 block mb-2">Description</span>
                  <p className="font-sans normal-case text-white/70 leading-relaxed text-sm tracking-normal">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                    Select quantity:
                  </span>
                  <div className="flex items-center bg-[#1C1C1C] border border-white/10 rounded-full overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      className="px-4 py-2 hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-6 font-mono text-sm font-bold text-white select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-4 py-2 hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAdmin ? (
                <div className="flex-1 flex gap-3">
                  <Link
                    to={`/admin/add-product?editing=true&id=${product._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-ochi-charcoal hover:bg-ochi-green transition-all duration-300 font-mono text-xs uppercase tracking-wider font-bold cursor-pointer"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Modify Release</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-rose-950/20 border border-rose-900/40 hover:bg-rose-600 hover:text-white text-rose-400 transition-all duration-300 font-mono text-xs uppercase tracking-wider font-bold disabled:opacity-40 cursor-pointer"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Erasing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Specs</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal transition-all duration-300 font-mono text-xs uppercase tracking-wider font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              )}

              {/* Save / Favorite Action */}
              <button
                onClick={handleToggleFavourite}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-full border font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                  isFavourite
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                    : 'border-white/20 text-white/80 hover:border-white/50 hover:bg-white/5'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavourite ? 'fill-rose-450 text-rose-400' : ''}`} />
                <span>{isFavourite ? 'Wishlisted' : 'Wishlist'}</span>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10 font-mono text-[10px] uppercase tracking-wider text-white/50">
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-ochi-green" />
                <span>Secure Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-ochi-green" />
                <span>Certified Genuine</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-ochi-green" />
                <span>14-day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-ochi-green" />
                <span>Fragile Packing</span>
              </div>
            </div>

          </div>
        </section>

        {/* --- Related Products Section --- */}
        <section className="px-6 py-16 md:px-12">
          <h2 className="font-sans text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-10">
            More Releases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard limit={3} />
          </div>
        </section>

      </div>
    </div>
  )
}

export default ProductDetail;