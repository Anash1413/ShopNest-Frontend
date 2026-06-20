import { useEffect, useState } from "react";
/** 
 * Custom hook for GET requests 
 * @param {string} url - API endpoint to fetch 
 * @param {object} options - Fetch options (headers, etc.) 
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
   const controller = new AbortController();
    let isMounted = true;

    const fetchdata = async () => {
      setisLoading(true);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP Error! code 001 BY ANASH Status: ${res.status}`);
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
       
     } catch (error) {
         if(isMounted && error.name !== 'AbortError'){
             setError(error.message || 'Something went wrong'); 
         }
     } finally {
        if (isMounted){
            setisLoading(false)
        }
     }
    }
    fetchdata()

    return () => {
      isMounted = false 
      controller.abort()
    };
  }, [url]);

  return { data , isLoading , error};
};

export default useFetch;
