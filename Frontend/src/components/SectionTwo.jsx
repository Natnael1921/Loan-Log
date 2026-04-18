import { Link } from "react-router-dom";
import "../styles/sectiontwo.css";

import {
  Users,
  Activity,
  TrendingUp,
  LayoutDashboard,
  Bell,
  ShieldCheck,
} from "lucide-react";

const SectionTwo = () => {
  return (
    <section className="section-two">
      {/* TOP */}
      <div className="dashboard">
        <div className="dashboard-image">
          <div className="img-placeholder2">
            <img src="/section2bg.png" />
          </div>
        </div>

        <div className="dashboard-text">
          <h2>Everything you need in one clean dashboard</h2>

          <div className="features">
            <div className="feature-box">
              <Users size={18} />
              <span>Friends & Balances</span>
            </div>

            <div className="feature-box">
              <Activity size={18} />
              <span>Transaction Tracking</span>
            </div>

            <div className="feature-box">
              <TrendingUp size={18} />
              <span>Instant Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* KEY FEATURES */}
      <div className="key-features" id="features">
        <h2>Key Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <LayoutDashboard size={20} />
            <h4>Real-Time Balance Tracking</h4>
          </div>

          <div className="feature-card">
            <Users size={20} />
            <h4>Friend-Based Loan System</h4>
          </div>

          <div className="feature-card">
            <Bell size={20} />
            <h4>Smart Notifications</h4>
          </div>

          <div className="feature-card">
            <ShieldCheck size={20} />
            <h4>Clear Debt Overview</h4>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2>Stop forgetting who owes who.</h2>

        <div className="cta-buttons btn">
          <Link to="/auth" className="btn green">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
