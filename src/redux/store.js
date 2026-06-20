import { configureStore } from "@reduxjs/toolkit"; 
// Importing our custom counter reducer block
import cartReducer from "./cartSlice"; 
 
// 2. Assembling the root store layer
export const store = configureStore({ 
  reducer: { 
    // Registering our counter slice into the global store under the 'counter' state 
   cart: cartReducer

  }, 
});