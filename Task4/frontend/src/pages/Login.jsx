import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/user/login",
        formData,
      );

      localStorage.setItem("loginUser", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      window.dispatchEvent(new Event("cartUpdated"));

      alert(res.data.message);
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__top">
          <h2 className="auth-card__title">Login Page</h2>
          <p className="auth-card__subtitle">
            Welcome back. Enter your email and password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn--primary btn--full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          <p className="auth-switch__text">
            If not registered?{" "}
            <Link to="/signup" className="auth-switch__link">
              Signup here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
