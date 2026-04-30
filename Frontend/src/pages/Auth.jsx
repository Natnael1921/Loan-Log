import { useState, useContext } from "react";
import {
  loginUser,
  sendCode,
  verifyCode,
  completeRegister,
} from "../services/auth.service";
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

  //step control
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    code: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // LOGIN FLOW
      if (isLogin) {
        const res = await loginUser({
          email: form.email,
          password: form.password,
        });

        login(res.data);
        navigate("/dashboard");
        return;
      }

      // STEP 1 → SEND CODE
      if (step === 1) {
        await sendCode({ email: form.email });
        setStep(2);
      }

      // STEP 2 → VERIFY CODE
      else if (step === 2) {
        await verifyCode({
          email: form.email,
          code: form.code,
        });
        setStep(3);
      }

      // STEP 3 → COMPLETE REGISTER
      else if (step === 3) {
        const res = await completeRegister({
          email: form.email,
          username: form.username,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });

        login(res.data);
        navigate("/dashboard");
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
            <h2>
              {isLogin
                ? "Welcome Back"
                : step === 1
                ? "Verify Your Email"
                : step === 2
                ? "Enter Code"
                : "Complete Registration"}
            </h2>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* EMAIL */}
              {!isLogin && step === 1 && (
                <div className="input-group">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {/* CODE */}
              {!isLogin && step === 2 && (
                <div className="input-group">
                  <KeyRound size={16} />
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {/* FINAL STEP */}
              {!isLogin && step === 3 && (
                <>
                  <div className="input-group">
                    <User size={16} />
                    <input
                      type="text"
                      placeholder="Username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
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

                  <div className="input-group">
                    <Lock size={16} />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </>
              )}

              {/* LOGIN FORM */}
              {isLogin && (
                <>
                  <div className="input-group">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
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
                </>
              )}

              <button type="submit">
                {isLogin
                  ? "Login"
                  : step === 1
                  ? "Send Code"
                  : step === 2
                  ? "Verify Code"
                  : "Create Account"}
              </button>
            </form>

            <p className="switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span
                onClick={() => {
                  setIsLogin(!isLogin);
                  setStep(1); // reset steps
                }}
              >
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