import { useEffect, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Home({ products }) {
  const [apiProducts, setApiProducts] = useState(products || []);
  const [localProducts, setLocalProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchLocalCreatedProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      const onlyUnsavedItems = res?.data?.filter(
        (item) => item.isSavedToDb === false,
      );
      setLocalProducts(onlyUnsavedItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setApiProducts(products || []);
  }, [products]);

  useEffect(() => {
    fetchLocalCreatedProducts();

    const handleProductAdded = (event) => {
      setLocalProducts((prev) => [...prev, event.detail]);
    };

    window.addEventListener("productAdded", handleProductAdded);

    return () => {
      window.removeEventListener("productAdded", handleProductAdded);
    };
  }, []);

  const allProducts = [...apiProducts, ...localProducts];

  const handleSelectAll = () => {
    if (selectedItems.length === allProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allProducts.map((item) => item.id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddToDatabase = async () => {
    try {
      const selectedProducts = allProducts.filter((item) =>
        selectedItems.includes(item.id),
      );

      for (let item of selectedProducts) {
        await axios.post("http://localhost:8080/api/products", {
          id: item.id,
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image,
          rating: item.rating,
          isSavedToDb: true,
        });
      }

      alert("Selected items saved to database successfully");
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      alert("Error while saving selected items");
    }
  };

  return (
    <section className="home-page">
      <div className="page-hero">
        <h1 className="page-hero__title">Home Page</h1>
        <p className="page-hero__subtitle">
          Explore all products with a premium modern dashboard experience.
        </p>
      </div>

      <div className="home-top-actions">
        <button className="btn btn--primary" onClick={handleSelectAll}>
          {selectedItems.length === allProducts.length && allProducts.length > 0
            ? "Unselect All Items"
            : "Select All Items"}
        </button>

        {selectedItems.length > 0 && (
          <button className="btn btn--success" onClick={handleAddToDatabase}>
            Add Selected Items To Database
          </button>
        )}
      </div>

      <div className="product-grid">
        {allProducts.map((item, index) => (
          <div key={`${item.id}-${index}`} className="product-card">
            <div className="product-card__check">
              <input
                className="product-checkbox"
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectOne(item.id)}
              />
            </div>

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

              <p className="product-card__category">
                <strong>Category:</strong> {item.category}
              </p>

              <p className="product-card__description">{item.description}</p>

              <p className="product-card__rating">
                <strong>Rating:</strong> {item?.rating?.rate} (
                {item?.rating?.count})
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Home;