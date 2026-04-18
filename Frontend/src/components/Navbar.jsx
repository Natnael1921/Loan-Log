import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LOGO AREA */}
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
          <span className="logo-span" onClick={() => navigate("/")}>Lendify</span>{" "}
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
