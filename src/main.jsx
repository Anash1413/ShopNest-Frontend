import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { AuthProvider } from "./context/authContext.jsx";
import { store } from './redux/store.js';

// Intercept global fetch to prepend backend URL for relative API calls
// const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').trim();
// console.log(import.meta.env.VITE_BACKEND_URL);
// if (BACKEND_URL) {
//   const originalFetch = window.fetch.bind(window);
//   const backendBaseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL : `${BACKEND_URL}/`;

//   const rewriteApiUrl = (input) => {
//     if (typeof input === 'string') {
//       if (input.startsWith('/api') || input.startsWith('api/')) {
//         const apiPath = input.startsWith('/') ? input.slice(1) : input;
//         return new URL(apiPath, backendBaseUrl).toString();
//       }
//       return input;
//     }

//     if (input instanceof URL) {
//       if (input.origin === window.location.origin && input.pathname.startsWith('/api')) {
//         return new URL(`${input.pathname}${input.search}`, backendBaseUrl).toString();
//       }
//       return input;
//     }

//     if (input instanceof Request) {
//       const requestUrl = new URL(input.url, window.location.href);
//       if (requestUrl.origin === window.location.origin && requestUrl.pathname.startsWith('/api')) {
//         return new Request(
//           new URL(`${requestUrl.pathname}${requestUrl.search}`, backendBaseUrl).toString(),
//           input,
//         );
//       }
//     }

//     return input;
//   };

//   window.fetch = (input, init) => originalFetch(rewriteApiUrl(input), init);
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
  <Provider store={store}>

    <App />
  </Provider>
  </AuthProvider>
  </StrictMode>,
)
