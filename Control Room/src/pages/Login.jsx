import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/LOGO3.png";
import { getUsers } from "../Services/api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getUsers(email, password);

      const data = response[0];

      if (response && response.length > 0) {
        // Call the onLogin prop with the token
        onLogin(data.token);

        // Store additional user data
        localStorage.setItem("userName", data.Name);
        localStorage.setItem("userEmail", data.Email);
        localStorage.setItem("userId", data.Id_number);
        localStorage.setItem("authToken", data.token);

        navigate("/home");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="logo-container">
          <div className="logo-wrapper">
            <img src={logo} alt="KPLC Logo" className="logo" />
          </div>
        </div>

        <div className="form-container">
          <h1 className="form-title">KPLC Permit</h1>
          <p className="form-subtitle">Sign in to access your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  className="input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                <i className="fas fa-envelope input-icon"></i>
              </div>
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                <i
                  className={`fas ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  } input-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>

            <div className="forgot-password">
              <span>Forgot password? </span>
              <a href="#" className="forgot-password-link">
                Click here
              </a>
            </div>

            {error && (
              <div className="error-container">
                <p className="error-text">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className={`submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? <div className="spinner"></div> : "Sign In Securely"}
            </button>

            <div className="security-badge">
              <i className="fas fa-lock"></i>
              <span>Secured by 256-bit encryption</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
