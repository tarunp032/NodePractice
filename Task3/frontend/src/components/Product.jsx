import { useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Product() {
  const [products, setProducts] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [updateData, setUpdateData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rate: "",
    count: "",
  });

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/products?saved=true",
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleViewDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/products/${id}`);
      setSelectedProduct(res.data);
      setDetailModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenUpdate = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/products/${id}`);
      const product = res.data;

      setSelectedProduct(product);
      setUpdateData({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rate: product?.rating?.rate,
        count: product?.rating?.count,
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

    try {
      await axios.put(
        `http://localhost:8080/api/products/${selectedProduct._id}`,
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
      );

      alert("Product updated successfully");
      setUpdateModal(false);
      fetchAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInactive = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/products/delete/${id}`);
      fetchAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/products/restore/${id}`);
      fetchAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/permanent/${id}`);
      fetchAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="products-page">
      <div className="page-hero">
        <h1 className="page-hero__title">Product Page</h1>
        <p className="page-hero__subtitle">
          Manage, update, restore and view all saved products beautifully.
        </p>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <div key={item._id} className="product-card product-card--manage">
            <div className="product-card__image-box">
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

              <div className="card-actions">
                <button
                  className="btn btn--outline"
                  onClick={() => handleViewDetails(item._id)}
                >
                  View Details
                </button>

                <button
                  className="btn btn--primary"
                  onClick={() => handleOpenUpdate(item._id)}
                >
                  Update
                </button>

                {item.status === "active" ? (
                  <button
                    className="btn btn--warning"
                    onClick={() => handleInactive(item._id)}
                  >
                    Inactive
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
        ))}
      </div>

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
