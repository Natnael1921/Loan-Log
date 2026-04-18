import { useState, useContext } from "react";
import { loginUser, registerUser } from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/auth.css";

import {
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Shield,
  KeyRound,
} from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await loginUser({
          email: form.email,
          password: form.password,
        });

        login(res.data);
        navigate("/dashboard");
      } else {
        await registerUser(form);
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* LEFT PANEL */}
          <div className="auth-left">
            <h1>Manage Your Money With Friends</h1>

            <p>
              Track loans, split expenses, and manage balances between friends
              in a simple and transparent way.
            </p>

            <div className="auth-features">
              <div>
                <User size={16} /> Manage friends easily
              </div>

              <div>
                <Shield size={16} /> Track who owes what
              </div>

              <div>
                <KeyRound size={16} /> Secure personal accounts
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="auth-right">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="input-group">
                  <User size={16} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <button type="submit">
                {isLogin ? (
                  <>
                    <LogIn size={16} /> Login
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Register
                  </>
                )}
              </button>
            </form>

            <p className="switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? " Register" : " Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
