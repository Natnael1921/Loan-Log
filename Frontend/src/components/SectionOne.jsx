import { Link } from "react-router-dom";
import "../styles/sectionone.css";
import { UserPlus, ArrowRightLeft, BarChart3, CheckCircle } from "lucide-react";

const SectionOne = () => {
  return (
    <section className="section-one">
      <div className="hero">
        {/* LEFT */}
        <div className="hero-text">
          <h1>
            Track money between friends
            easily
          </h1>

          <p>Request, track, and settle up with zero awkwardness.</p>

          <div className="hero-buttons">
            <Link to="/auth" className="btn blue">
              Get Started
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-image">
          <div className="img-placeholder"><img src="/section1bg.png"/></div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="how" id="how">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <div className="icon"><UserPlus size={18} /></div>
            <h4>Add Friends</h4>
            <p>Connect easily with friends</p>
          </div>

          <div className="step">
            <div className="icon"><ArrowRightLeft size={18} /></div>
            <h4>Request / Lend</h4>
            <p>Send or receive money</p>
          </div>

          <div className="step">
            <div className="icon"><BarChart3 size={18} /></div>
            <h4>Track</h4>
            <p>See balances clearly</p>
          </div>

          <div className="step">
            <div className="icon"><CheckCircle size={18} /></div>
            <h4>Settle Up</h4>
            <p>Mark transactions done</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionOne;