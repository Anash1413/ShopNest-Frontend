import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  User, 
  LogOut, 
  SlidersHorizontal, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Heart, 
  Loader2,
  ShoppingBag,
  Check,
  Tag,
  Trash2
} from "lucide-react";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

const ProductCard =  ({limit, products}) => {
  const { isAdmin } = useAuth();
  const [favourites, setFavourites] = useState([])
  const [cartItems, setCartItems] = useState([])
  const dispatch = useDispatch()
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const favRes = await fetch('/api/favourites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavourites((favData.favourites || []).map(item => item._id));
        }

        const cartRes = await fetch('/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItems((cartData.cart || []).map(item => item._id));
        }
      } catch (err) {
        console.error("Error syncing User Data in ProductCard:", err);
      }
    };
    fetchUserData();
  }, [token]);

  const handleaddtocart = async (id)=>{
     try {
       await dispatch(addToCart(id))
       toast.success('Item added to cart')
     } catch (error) {
       toast.error('Error adding item')
     }
  }

  const handleDelete = async (productId) => {
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
      color: "#ffffff",
      customClass: {
        popup: "border border-white/10 rounded-2xl shadow-2xl bg-[#212121] p-8 font-sans text-center",
        title: "text-lg font-black text-white tracking-tight uppercase mb-2",
        htmlContainer: "text-white/60 text-xs font-mono uppercase tracking-wider leading-relaxed mb-6",
        confirmButton: "px-5 py-2 rounded-full bg-rose-650 hover:bg-rose-500 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200",
        cancelButton: "px-5 py-2 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200 mr-3"
      }
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/product/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: productId })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error("Error deleting product: " + err.message);
      console.error(err);
    }
  };

  const { data: fetchedData, isLoading: fetchLoading, error: fetchError } =  useFetch('/api/product/', {
    method: 'GET',
  })

  const data = products ? { products } : fetchedData;
  const isLoading = products ? false : fetchLoading;
  const error = products ? null : fetchError;
  let displaylist = null

  return (
    <>
      {error && (
        <div className="col-span-full py-8 text-center text-rose-450 font-mono text-xs uppercase tracking-wider">
          Error occurred: "{error.message || error}"
        </div>
      )}
      {isLoading ? (
        <div className="col-span-full py-16 text-center text-white/50 font-mono text-xs uppercase tracking-wider">
          Fetching product releases...
        </div>
      ) : (
        data && (displaylist = limit ? data.products.slice(0,limit) : data.products,
        displaylist.map((product, index) => (
          
          <div key={product._id} className="group relative bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 rounded-2xl p-5 transition-all duration-350 hover:scale-[1.01] flex flex-col justify-between h-full">
            <div>
              {/* Favorite Button */}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!token) {
                    toast.error("Please log in to save favourites");
                    return;
                  }
                  const isFav = favourites.includes(product._id);
                  try {
                    const res = await fetch('/api/favourites', {
                      method: isFav ? 'DELETE' : 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ productId: product._id })
                    });
                    if (!res.ok) throw new Error("Failed to update saved items");
                    if (isFav) {
                      setFavourites(favourites.filter(id => id !== product._id));
                      toast.success("Removed from saved items");
                    } else {
                      setFavourites([...favourites, product._id]);
                      toast.success("Saved to favourites", { icon: '❤️' });
                    }
                  } catch (err) {
                    toast.error(err.message || "Could not update saved items");
                  }
                }}
                className={`absolute top-4 right-4 px-3 py-1 rounded-full border z-10 transition-all duration-300 font-mono text-[9px] uppercase tracking-wider cursor-pointer active:scale-95 ${
                  favourites.includes(product._id)
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-black/40 border-white/15 text-white/70 hover:bg-white hover:text-ochi-charcoal'
                }`}
              >
                {favourites.includes(product._id) ? 'Saved' : 'Save'}
              </button>

              {/* Product Image */}
              <Link to={`/product/${product._id}`} className="block relative aspect-square w-full bg-[#262626] rounded-xl overflow-hidden mb-4 border border-white/5">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full transform group-hover:scale-102 transition-transform duration-[400ms] ease-out"
                />
              </Link>

              {/* Brand & Category */}
              <div className="flex items-center justify-between font-mono text-[10px] text-white/40 uppercase tracking-wider mb-2">
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

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Price</span>
                <span className="text-lg font-black text-white">${product.price}</span>
              </div>
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/add-product?editing=true&id=${product._id}`}
                    className="px-3 py-1.5 rounded-full border border-white/20 hover:bg-white hover:text-ochi-charcoal text-white transition-all font-mono text-[10px] uppercase tracking-wider"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(product._id);
                    }}
                    className="px-3 py-1.5 rounded-full border border-rose-500/20 hover:bg-rose-600 hover:text-white text-rose-400 transition-all font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleaddtocart(product._id)
                    if (cartItems.includes(product._id)) {
                      setCartItems(cartItems.filter(id => id !== product._id))
                    } else {
                      setCartItems([...cartItems, product._id])
                    }
                  }}
                  className={`px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    cartItems.includes(product._id)
                      ? 'bg-ochi-green border-ochi-green text-ochi-charcoal'
                      : 'border-white/25 hover:border-ochi-green hover:bg-ochi-green hover:text-ochi-charcoal text-white'
                  }`}
                >
                  {cartItems.includes(product._id) ? 'Added' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        )))
      )}
    </>
  );
};

export default ProductCard;