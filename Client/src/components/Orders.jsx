import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user?._id) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/orders/${user._id}`);
          setOrders(res.data.orders || []);
        } catch (err) {
          console.error("Failed to fetch orders", err);
        }
      };

      fetchOrders();
    }
  }, [user, loading, navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: <span className="font-mono">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xl font-semibold text-green-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 border rounded p-2"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
