import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    phone: "",
    gender: "",
    city: "",
    address: "",
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

      const res = await axios.post("http://localhost:8080/user/signup", {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__top">
          <h2 className="auth-card__title">Create Your Account</h2>
          <p className="auth-card__subtitle">
            Join with a premium signup experience and manage your profile beautifully.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter email"
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
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              className="form-input"
              type="number"
              name="age"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-input"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              className="form-input"
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group form-group--full">
            <label className="form-label">Address</label>
            <textarea
              className="form-input form-textarea"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group form-group--full">
            <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Signup"}
            </button>
          </div>
        </form>

        <div className="auth-switch">
          <p className="auth-switch__text">
            Already registered? <Link to="/login" className="auth-switch__link">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;