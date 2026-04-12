import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Home({ products }) {
  const [apiProducts, setApiProducts] = useState(products || []);
  const [localProducts, setLocalProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  const fetchLocalCreatedProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/product/api/products");
      const onlyUnsavedItems = res.data.filter(
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

  const filteredAndSortedProducts = useMemo(() => {
    let updatedProducts = [...allProducts];

    if (searchTerm.trim()) {
      updatedProducts = updatedProducts.filter((item) => {
        const title = item.title?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        return title.includes(search) || description.includes(search);
      });
    }

    if (sortPrice === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortPrice === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    return updatedProducts;
  }, [allProducts, searchTerm, sortPrice]);

  const handleSelectAll = () => {
    if (
      selectedItems.length === filteredAndSortedProducts.length &&
      filteredAndSortedProducts.length > 0
    ) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedProducts.map((item) => item.id));
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
        await axios.post("http://localhost:8080/product/api/products", {
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

      setLocalProducts((prev) =>
        prev.filter((item) => !selectedItems.includes(item.id)),
      );
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      alert("Error while saving selected items");
    }
  };

  return (
    <section className="home-page">
      <div className="page-hero premium-hero">
        <h1 className="page-hero__title">Home Page</h1>
        <p className="page-hero__subtitle">
          Explore all products with a premium modern dashboard experience.
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
            <button
              className="btn btn--success premium-btn premium-btn--success"
              onClick={handleAddToDatabase}
            >
              Add Selected Items To Database
            </button>
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

      {allProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No products available</h3>
          <p>Products will appear here once data is loaded.</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No matching products found</h3>
          <p>Try searching with another keyword or change sorting/filter.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredAndSortedProducts.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="product-card premium-card"
            >
              <div className="product-card__check">
                <input
                  className="product-checkbox"
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectOne(item.id)}
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

                <p className="product-card__category">
                  <strong>Category:</strong> {item.category}
                </p>

                <p className="product-card__description">{item.description}</p>

                <p className="product-card__rating">
                  <strong>Rating:</strong> {item?.rating?.rate ?? "N/A"} (
                  {item?.rating?.count ?? 0})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
