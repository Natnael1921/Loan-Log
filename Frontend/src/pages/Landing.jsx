import { Link } from "react-router-dom";
import "../styles/Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>LoanLog</h1>
        <p>Track loans with friends easily and transparently</p>

        <div className="landing-buttons">
          <Link to="/auth" className="btn primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
