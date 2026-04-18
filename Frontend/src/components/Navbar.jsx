import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LOGO AREA */}
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
          <span>Lendify</span>
        </div>

        {/* LINKS */}
        <div className="nav-links">
          <a href="#how">How It Works</a>
          <a href="#features">Features</a>
          <Link to="/auth">Login</Link>
          <Link to="/auth" className="register-btn">
            Register
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;