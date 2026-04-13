import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem("loginUser");
  const loginUser = savedUser ? JSON.parse(savedUser) : null;

  const [cartCount, setCartCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rate: "",
    count: "",
  });

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8080/cart");
      const totalQty = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch (err) {
      console.log(err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdated = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: Date.now(),
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image,
      rating: {
        rate: Number(formData.rate),
        count: Number(formData.count),
      },
      isSavedToDb: false,
    };

    window.dispatchEvent(
      new CustomEvent("productAdded", {
        detail: payload,
      })
    );

    alert("Item added successfully");

    setFormData({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
      rate: "",
      count: "",
    });

    setOpenModal(false);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("loginUser");
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Logout successful");
    navigate("/login");
  };

  const handleProductClick = () => {
    if (!loginUser) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    navigate("/products");
  };

  const handleCartClick = () => {
    if (!loginUser) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h2 className="header__logo" onClick={() => navigate("/")}>
            Product Task
          </h2>

          <div className="header__actions">
            <button className="btn btn--nav" onClick={() => navigate("/")}>
              Home
            </button>

            <button className="btn btn--nav" onClick={handleProductClick}>
              Products
            </button>

            <button
              className="btn btn--primary"
              onClick={() => setOpenModal(true)}
            >
              Add Item
            </button>

            <button
              className="btn btn--nav cart-header-btn"
              onClick={handleCartClick}
            >
              Cart <span className="cart-count-badge">{cartCount}</span>
            </button>

            {!loginUser ? (
              <button
                className="btn btn--secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <>
                <button
                  className="btn btn--nav user-pill-btn"
                  onClick={() => navigate("/profile")}
                >
                  {loginUser.name}
                </button>

                <button className="btn btn--danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal-card modal-card--large">
            <div className="modal-card__top">
              <h2 className="modal-card__title">Add New Item</h2>
              <p className="modal-card__subtitle">
                Fill all details to create a beautiful new product card.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  className="form-input"
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  name="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  type="text"
                  name="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  className="form-input"
                  type="text"
                  name="image"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating Rate</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.1"
                  name="rate"
                  placeholder="Enter rating"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating Count</label>
                <input
                  className="form-input"
                  type="number"
                  name="count"
                  placeholder="Enter rating count"
                  value={formData.count}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions form-group--full">
                <button className="btn btn--primary" type="submit">
                  Submit
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;