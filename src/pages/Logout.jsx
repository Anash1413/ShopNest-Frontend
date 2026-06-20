import Swal from "sweetalert2";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Logout | ShopNest';
    Swal.fire({
      title: "Confirm Log Out?",
      text: "Are you sure you want to end your active ShopNest session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#212121",
      color: "#F1F1F1",
      buttonsStyling: false,
      customClass: {
        popup: "border border-white/10 rounded-2xl shadow-2xl bg-[#212121] p-8 font-sans text-center",
        title: "text-lg font-black text-white tracking-tight uppercase mb-2",
        htmlContainer: "text-white/60 text-xs font-mono uppercase tracking-wider leading-relaxed mb-6",
        confirmButton: "px-5 py-2 rounded-full bg-rose-650 hover:bg-rose-500 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200",
        cancelButton: "px-5 py-2 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200 mr-3"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      } else {
        navigate("/");
      }
    });
  }, [logout, navigate]);

  return (
    <div className="min-h-screen justify-center items-center flex bg-ochi-charcoal border-t border-white/10">
      <NavLink className="px-6 py-3 rounded-full border border-white/20 hover:border-white text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer" to="/">
        Go to Home
      </NavLink>
    </div>
  );
}

export default Logout;
