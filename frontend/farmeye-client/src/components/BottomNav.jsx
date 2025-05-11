// src/components/BottomNav.jsx
import { Home, Bookmark, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const base = "flex flex-col items-center gap-1 text-xs";
  const active = "text-green-600";
  const inactive = "text-gray-400";

  return (
    <nav className="fixed bottom-0 inset-x-0 h-14 bg-white border-t border-gray-100 flex justify-around md:hidden">
      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <Home className="w-5 h-5" />
        Home
      </NavLink>
      <NavLink to="/saved" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <Bookmark className="w-5 h-5" />
        Saved
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <User className="w-5 h-5" />
        Profile
      </NavLink>
    </nav>
  );
}
