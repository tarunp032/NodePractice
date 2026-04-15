import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartMap, setCartMap] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [updateData, setUpdateData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rate: "",
    count: "",
  });

  const removeAuthData = () => {
    localStorage.removeItem("loginUser");
    localStorage.removeItem("token");
  };

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8080/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mappedCart = {};
      for (let i = 0; i < res.data.length; i++) {
        mappedCart[res.data[i].productId] = res.data[i].quantity;
      }

      setCartMap(mappedCart);
    } catch (error) {
      console.log(error);
      setCartMap({});
    }
  };

  const notifyCartUpdate = () => {
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const fetchAllProducts = async (showLoader = true) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      }

      const res = await axios.get(
        "http://localhost:8080/product/api/products?saved=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);

      if (error?.response?.status === 401) {
        removeAuthData();
        alert("Session expired, please login again");
        navigate("/login");
        return;
      }

      setProducts([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const fetchSearchedProducts = async (searchValue, showLoader = true) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      }

      if (!searchValue.trim()) {
        const res = await axios.get(
          "http://localhost:8080/product/api/products?saved=true",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProducts(res.data);
        return;
      }

      const res = await axios.get(
        `http://localhost:8080/product/api/products?saved=true&search=${encodeURIComponent(
          searchValue,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCartItems();
  }, []);

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartItems();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchSearchedProducts(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const filteredAndSortedProducts = useMemo(() => {
    let updatedProducts = [...products];

    if (sortPrice === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortPrice === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    return updatedProducts;
  }, [products, sortPrice]);

  const handleViewDetails = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/product/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSelectedProduct(res.data);
      setDetailModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenUpdate = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/product/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const product = res.data;

      if (product.status !== "active") {
        alert("Inactive product cannot be updated");
        return;
      }

      setSelectedProduct(product);
      setUpdateData({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rate: product?.rating?.rate || "",
        count: product?.rating?.count || "",
      });

      setUpdateModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (selectedProduct?.status !== "active") {
      alert("Inactive product cannot be updated");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/product/api/products/${selectedProduct._id}`,
        {
          title: updateData.title,
          price: Number(updateData.price),
          description: updateData.description,
          category: updateData.category,
          image: updateData.image,
          rating: {
            rate: Number(updateData.rate),
            count: Number(updateData.count),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts((prev) =>
        prev.map((item) =>
          item._id === selectedProduct._id
            ? {
                ...item,
                title: updateData.title,
                price: Number(updateData.price),
                description: updateData.description,
                category: updateData.category,
                image: updateData.image,
                rating: {
                  rate: Number(updateData.rate),
                  count: Number(updateData.count),
                },
              }
            : item,
        ),
      );

      alert("Product updated successfully");
      setUpdateModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/cart/add",
        {
          productId: item._id,
          title: item.title,
          price: item.price,
          image: item.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCartItems();
      notifyCartUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleIncreaseCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/cart/increase/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchCartItems();
      notifyCartUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecreaseCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/cart/decrease/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchCartItems();
      notifyCartUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBulkAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const selectedProducts = products.filter((p) =>
        selectedItems.includes(p._id),
      );

      for (let i = 0; i < selectedProducts.length; i++) {
        await axios.post(
          "http://localhost:8080/cart/add",
          {
            productId: selectedProducts[i]._id,
            title: selectedProducts[i].title,
            price: selectedProducts[i].price,
            image: selectedProducts[i].image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      await fetchCartItems();
      notifyCartUpdate();
      alert("Selected items added to cart");
    } catch (err) {
      console.log(err);
    }
  };

  const handleInactive = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/product/api/products/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "inactive" } : item,
        ),
      );

      if (selectedProduct?._id === id) {
        setSelectedProduct((prev) =>
          prev ? { ...prev, status: "inactive" } : prev,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/product/api/products/restore/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "active" } : item,
        ),
      );

      if (selectedProduct?._id === id) {
        setSelectedProduct((prev) =>
          prev ? { ...prev, status: "active" } : prev,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/product/api/products/permanent/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts((prev) => prev.filter((item) => item._id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));

      if (selectedProduct?._id === id) {
        setSelectedProduct(null);
        setDetailModal(false);
        setUpdateModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedItems.length === filteredAndSortedProducts.length &&
      filteredAndSortedProducts.length > 0
    ) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedProducts.map((item) => item._id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  const handleBulkSoftDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const selectedIds = [...selectedItems];

      for (let i = 0; i < selectedIds.length; i++) {
        await axios.put(
          `http://localhost:8080/product/api/products/delete/${selectedIds[i]}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      setProducts((prev) =>
        prev.map((item) =>
          selectedIds.includes(item._id)
            ? { ...item, status: "inactive" }
            : item,
        ),
      );

      alert("Selected products soft deleted successfully");
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      alert("Error while soft deleting selected products");
    }
  };

  const handleBulkRestore = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const selectedIds = [...selectedItems];

      for (let i = 0; i < selectedIds.length; i++) {
        await axios.put(
          `http://localhost:8080/product/api/products/restore/${selectedIds[i]}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      setProducts((prev) =>
        prev.map((item) =>
          selectedIds.includes(item._id) ? { ...item, status: "active" } : item,
        ),
      );

      alert("Selected products restored successfully");
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      alert("Error while restoring selected products");
    }
  };

  const handleBulkPermanentDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const selectedIds = [...selectedItems];

      for (let i = 0; i < selectedIds.length; i++) {
        await axios.delete(
          `http://localhost:8080/product/api/products/permanent/${selectedIds[i]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      setProducts((prev) =>
        prev.filter((item) => !selectedIds.includes(item._id)),
      );

      if (selectedProduct && selectedIds.includes(selectedProduct._id)) {
        setSelectedProduct(null);
        setDetailModal(false);
        setUpdateModal(false);
      }

      alert("Selected products permanently deleted successfully");
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      alert("Error while permanently deleting selected products");
    }
  };

  return (
    <section className="products-page">
      <div className="page-hero premium-hero">
        <h1 className="page-hero__title">Product Page</h1>
        <p className="page-hero__subtitle">
          Manage, update, restore and view all saved products beautifully.
        </p>
      </div>

      <div className="home-controls-wrapper">
        <div className="home-filters">
          <div className="home-search-box">
            <input
              type="text"
              placeholder="Search by title or description..."
              className="home-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="home-sort-box">
            <select
              className="home-sort-select"
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
            >
              <option value="">Sort By Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="home-top-actions">
          <button
            className="btn btn--primary premium-btn"
            onClick={handleSelectAll}
          >
            {selectedItems.length === filteredAndSortedProducts.length &&
            filteredAndSortedProducts.length > 0
              ? "Unselect All Items"
              : "Select All Items"}
          </button>

          {selectedItems.length > 0 && (
            <button className="btn btn--success" onClick={handleBulkAddToCart}>
              Add Selected to Cart
            </button>
          )}

          {selectedItems.length > 0 && (
            <>
              <button
                className="btn btn--warning premium-btn"
                onClick={handleBulkSoftDelete}
              >
                Soft Delete Selected
              </button>

              <button
                className="btn btn--success premium-btn premium-btn--success"
                onClick={handleBulkRestore}
              >
                Restore Selected
              </button>

              <button
                className="btn btn--danger premium-btn"
                onClick={handleBulkPermanentDelete}
              >
                Permanent Delete Selected
              </button>
            </>
          )}
        </div>
      </div>

      <div className="home-results-bar">
        <div className="home-results-left">
          <p className="home-results-text">
            Showing <span>{filteredAndSortedProducts.length}</span> product(s)
          </p>

          <div className="selected-count-badge">
            Selected <span>{selectedItems.length}</span>
          </div>
        </div>

        {(searchTerm || sortPrice) && (
          <button
            className="clear-filter-btn"
            onClick={() => {
              setSearchTerm("");
              setSortPrice("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Searching products...</h3>
          <p>Please wait while we fetch matching products from backend.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products available</h3>
          <p>Saved products will appear here once data is loaded.</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No matching products found</h3>
          <p>Try another keyword or change the sorting option.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredAndSortedProducts.map((item) => {
            const qty = cartMap[item._id] || 0;

            return (
              <div
                key={item._id}
                className="product-card product-card--manage premium-card"
              >
                <div className="product-card__check">
                  <input
                    className="product-checkbox"
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelectOne(item._id)}
                  />
                </div>

                <div className="product-card__image-box premium-image-box">
                  <LazyLoadImage
                    src={item.image}
                    alt={item.title}
                    className="product-card__image"
                  />
                </div>

                <div className="product-card__body">
                  <h3 className="product-card__title">{item.title}</h3>
                  <p className="product-card__price">${item.price}</p>

                  <p className="product-card__status">
                    <strong>Status:</strong> {item.status}
                  </p>

                  <p className="product-card__category">
                    <strong>Category:</strong> {item.category}
                  </p>

                  <p className="product-card__description">
                    {item.description}
                  </p>

                  <p className="product-card__rating">
                    <strong>Rating:</strong> {item?.rating?.rate ?? "N/A"} (
                    {item?.rating?.count ?? 0})
                  </p>

                  <div className="card-actions">
                    <button
                      className="btn btn--outline"
                      onClick={() => handleViewDetails(item._id)}
                    >
                      View Details
                    </button>

                    {qty === 0 ? (
                      <button
                        className="btn btn--success"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="product-qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleDecreaseCart(item._id)}
                        >
                          -
                        </button>
                        <span className="qty-count">{qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleIncreaseCart(item._id)}
                        >
                          +
                        </button>
                      </div>
                    )}

                    <button
                      className="btn btn--primary"
                      onClick={() => handleOpenUpdate(item._id)}
                      disabled={item.status !== "active"}
                    >
                      {item.status === "active" ? "Update" : "Update Disabled"}
                    </button>

                    {item.status === "active" ? (
                      <button
                        className="btn btn--warning"
                        onClick={() => handleInactive(item._id)}
                      >
                        Soft Delete
                      </button>
                    ) : (
                      <button
                        className="btn btn--success"
                        onClick={() => handleRestore(item._id)}
                      >
                        Restore
                      </button>
                    )}

                    <button
                      className="btn btn--danger"
                      onClick={() => handlePermanentDelete(item._id)}
                    >
                      Permanent Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detailModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-card__top">
              <h2 className="modal-card__title">Product Details</h2>
            </div>

            <div className="details-card">
              <div className="details-card__image-box">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="details-card__image"
                />
              </div>

              <div className="details-card__content">
                <p>
                  <strong>Title:</strong> {selectedProduct.title}
                </p>
                <p>
                  <strong>Price:</strong> ${selectedProduct.price}
                </p>
                <p>
                  <strong>Description:</strong> {selectedProduct.description}
                </p>
                <p>
                  <strong>Category:</strong> {selectedProduct.category}
                </p>
                <p>
                  <strong>Rating:</strong> {selectedProduct?.rating?.rate} (
                  {selectedProduct?.rating?.count})
                </p>
                <p>
                  <strong>Status:</strong> {selectedProduct.status}
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn--ghost"
                onClick={() => setDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {updateModal && (
        <div className="modal-overlay">
          <div className="modal-card modal-card--large">
            <div className="modal-card__top">
              <h2 className="modal-card__title">Update Product</h2>
              <p className="modal-card__subtitle">
                Edit product information with the premium form layout.
              </p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  value={updateData.title}
                  onChange={handleUpdateChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  className="form-input"
                  type="number"
                  name="price"
                  value={updateData.price}
                  onChange={handleUpdateChange}
                  required
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  name="description"
                  value={updateData.description}
                  onChange={handleUpdateChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  type="text"
                  name="category"
                  value={updateData.category}
                  onChange={handleUpdateChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  className="form-input"
                  type="text"
                  name="image"
                  value={updateData.image}
                  onChange={handleUpdateChange}
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
                  value={updateData.rate}
                  onChange={handleUpdateChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating Count</label>
                <input
                  className="form-input"
                  type="number"
                  name="count"
                  value={updateData.count}
                  onChange={handleUpdateChange}
                  required
                />
              </div>

              <div className="form-actions form-group--full">
                <button className="btn btn--primary" type="submit">
                  Update
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setUpdateModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Product;
