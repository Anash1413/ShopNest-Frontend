import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function ProtectedRouts({ adminOnly = false}) {
const {isAuthentic , isAdmin} = useAuth()
if(!isAuthentic){
   return <Navigate to="/login" replace />
}
if(adminOnly && !isAdmin){
return <Navigate to="/" replace />
}
  return <Outlet />
}

export default ProtectedRouts
