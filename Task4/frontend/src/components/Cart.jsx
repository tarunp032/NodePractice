import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8080/cart");
      setCartItems(res.data);
    } catch (err) {
      console.log(err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const notifyCartUpdate = () => {
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleIncrease = async (productId) => {
    try {
      await axios.put(`http://localhost:8080/cart/increase/${productId}`);

      const updatedItems = [];
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        if (item.productId === productId) {
          updatedItems.push({
            ...item,
            quantity: item.quantity + 1,
          });
        } else {
          updatedItems.push(item);
        }
      }

      setCartItems(updatedItems);
      notifyCartUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecrease = async (productId) => {
    try {
      await axios.put(`http://localhost:8080/cart/decrease/${productId}`);

      const updatedItems = [];
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        if (item.productId === productId) {
          const newQty = item.quantity - 1;

          if (newQty > 0) {
            updatedItems.push({
              ...item,
              quantity: newQty,
            });
          }
        } else {
          updatedItems.push(item);
        }
      }

      setCartItems(updatedItems);
      notifyCartUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/cart/remove/${productId}`);

      const updatedItems = [];
      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].productId !== productId) {
          updatedItems.push(cartItems[i]);
        }
      }

      setCartItems(updatedItems);
      notifyCartUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  let totalAmount = 0;
  let totalItems = 0;

  for (let i = 0; i < cartItems.length; i++) {
    totalAmount = totalAmount + cartItems[i].price * cartItems[i].quantity;
    totalItems = totalItems + cartItems[i].quantity;
  }

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        <h2 className="cart-title">My Cart</h2>

        {loading ? (
          <p className="cart-empty">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="cart-empty">No items in cart</p>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-card">
                  <div className="cart-card-left">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-image"
                    />
                  </div>

                  <div className="cart-card-right">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <p className="cart-item-price">₹{item.price}</p>

                    <div className="cart-qty-box">
                      <button
                        className="qty-btn"
                        onClick={() => handleDecrease(item.productId)}
                      >
                        -
                      </button>

                      <span className="qty-count">{item.quantity}</span>

                      <button
                        className="qty-btn"
                        onClick={() => handleIncrease(item.productId)}
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-subtotal">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Cart Summary</h3>
              <p>
                Total Items: <strong>{totalItems}</strong>
              </p>
              <p>
                Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;