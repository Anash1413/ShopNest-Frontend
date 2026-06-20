import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  ArrowLeft,
  Tag,
  Trash2,
  Loader2,
  ShoppingBag,
  Check,
  Plus,
  Star
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import toast from 'react-hot-toast'

function Favourites() {
  const dispatch = useDispatch()
  const [favourites, setFavourites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const token = localStorage.getItem('token')

  const fetchFavourites = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/favourites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to load favourites')
      const data = await res.json()
      setFavourites(data.favourites || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Saved Items | ShopNest'
    if (token) {
      fetchFavourites()
    } else {
      setError('Please log in to view favourites.')
      setIsLoading(false)
    }
  }, [token])

  const handleRemoveFavourite = async (productId) => {
    try {
      const res = await fetch('/api/favourites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })
      if (!res.ok) throw new Error('Failed to remove from wishlist')
      setFavourites(prev => prev.filter(item => item._id !== productId))
      toast.success('Removed from saved items', {
        icon: '🗑️',
        style: {
          borderRadius: '9999px',
          background: '#1C1C1C',
          color: '#F1F1F1',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      })
    } catch (err) {
      toast.error(err.message || 'Could not update saved items')
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart(productId)).unwrap()
      toast.success('Item added to cart')
      setCartItems([...cartItems, productId])
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full">
        
        {/* Navigation Back */}
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
              Wishlist Vault
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Your Favourites
            </h1>
          </div>
          <p className="font-mono text-xs text-white/45 uppercase tracking-wider max-w-sm leading-relaxed">
            Keep track of items you love. Add them to your cart directly, or remove them when you change your mind.
          </p>
        </header>

        {/* Content Section */}
        <div className="w-full text-left">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 font-mono">
              <Loader2 className="h-8 w-8 text-ochi-green animate-spin" />
              <span className="text-white/40 text-xs uppercase tracking-widest">Syncing saved records...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-white/10 rounded-2xl bg-[#1C1C1C] p-8 max-w-lg mx-auto">
              <h3 className="text-rose-400 font-black uppercase tracking-tight text-lg mb-2">Failed to Sync</h3>
              <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-6">{error}</p>
              <button 
                onClick={fetchFavourites}
                className="px-6 py-3 border border-white/20 text-white hover:bg-white hover:text-ochi-charcoal rounded-full font-mono font-bold transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Retry Fetch
              </button>
            </div>
          ) : favourites.length === 0 ? (
            <div className="text-center py-16 border border-white/10 rounded-2xl bg-[#1C1C1C] p-8 max-w-lg mx-auto flex flex-col items-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/30">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-white font-black uppercase tracking-tight text-xl mb-2">No Saved Releases</h3>
              <p className="text-white/60 font-mono text-xs uppercase tracking-wider mb-8 max-w-xs leading-relaxed">
                Your wishlist is empty. Explore our catalog of designed essentials to add products to your favorites.
              </p>
              <Link 
                to="/products"
                className="px-8 py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Browse Store</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favourites.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 rounded-2xl p-5 transition-all duration-350 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Product Image */}
                    <Link to={`/product/${product._id}`} className="block relative aspect-square w-full bg-[#262626] rounded-xl overflow-hidden mb-4 border border-white/5">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full transform group-hover:scale-102 transition-transform duration-[400ms] ease-out"
                      />
                    </Link>

                    {/* Brand & Category */}
                    <div className="flex items-center justify-between font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
                      <span>{product.brand}</span>
                      <span className="text-ochi-green">
                        {product.category}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-base font-black text-white hover:text-ochi-green transition-colors uppercase tracking-tight leading-tight line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50 uppercase tracking-wider mb-4">
                      <span className="text-ochi-green">★</span>
                      <span>{product.rating}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/30">{product.numReviews} Reviews</span>
                    </div>
                  </div>

                  {/* Price & Add to Cart / Delete actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Price</span>
                      <span className="text-lg font-black text-white">${product.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Delete Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFavourite(product._id)}
                        className="px-3 py-1.5 rounded-full border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-white/70 hover:text-rose-400 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95"
                        title="Remove wishlist item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className={`px-3.5 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer ${
                          cartItems.includes(product._id)
                            ? 'bg-ochi-green border-ochi-green text-ochi-charcoal font-bold'
                            : 'border-white/20 hover:border-ochi-green hover:bg-ochi-green hover:text-ochi-charcoal text-white'
                        }`}
                        title={cartItems.includes(product._id) ? 'Added to Cart' : 'Add to Cart'}
                      >
                        {cartItems.includes(product._id) ? (
                          <Check className="h-3.5 w-3.5 text-ochi-charcoal" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
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

export default Favourites;
