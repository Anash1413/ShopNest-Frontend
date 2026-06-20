import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 1. THUNK: Fetch initial cart items when the user logs in / visits the site
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      return data; // This will populate your initialState safely!
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. THUNK: Add an item to the cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productID, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ _id: productID }) // Send it as a clean JSON string
      });

      if (!response.ok) throw new Error('Failed to add item');
      
      const data = await response.json();
      return data; // Make sure your backend returns the updated cart list here
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. THUNK: Delete an item from the cart
export const deleteToCart = createAsyncThunk(
  'cart/deleteToCart',
  async (productID, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', { // Make sure this matches your backend route
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ _id: productID })
      });

      if (!response.ok) throw new Error('Failed to remove item');

      // Assuming your backend returns a success message or the updated cart
      const data = await response.json();
      return { productID, data }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. THE SLICE
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [], // Safe synchronous default
    isloading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart Handlers
      .addCase(fetchCart.pending, (state) => {
        state.isloading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isloading = false;
        state.cartItems = action.payload.cart; // Your database cart is now loaded!
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Add To Cart Handlers
      .addCase(addToCart.pending, (state) => {
        state.isloading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isloading = false;
        state.cartItems = action.payload.cart; 
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete From Cart Handlers
      .addCase(deleteToCart.pending, (state) => {
        state.isloading = true;
      })
      .addCase(deleteToCart.fulfilled, (state, action) => {
        state.isloading = false;
        // Filter out the deleted item ID instantly from your Redux UI state
       state.cartItems = state.cartItems.filter((item)=> !action.payload.productID.includes(item._id))
      })
      .addCase(deleteToCart.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      });
  }
});

export default cartSlice.reducer;