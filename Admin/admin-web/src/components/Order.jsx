import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  InputGroup,
  Pagination,
  Modal,
  Badge,
  Dropdown,
} from "react-bootstrap";

import axios from "axios";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistically update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Send API request
      const res = await axios.patch(
        `http://localhost:9999/api/order/update-status/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (!res.data.success) {
        throw new Error("Failed to update order status.");
      }

      console.log(`✅ Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating status:", error);

      // Revert UI update if API request fails
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: order.status } : order
        )
      );
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/order/orders");
        const data = res.data?.data; // Adjust this based on API response structure
        console.log(data);
        setOrders(data); // Assuming you have a state variable setOrders
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Order Management</h2>
          <p className="text-muted">Total: {orders.length} orders</p>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th>Order Id</th>
                <th>Name</th>
                <th>Zip Code</th>
                <th>Shipping Cost</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord, index) => (
                <tr key={ord._id}>
                  <td>{`ORD_${index + 1}`}</td>
                  <td>{ord.name}</td>
                  <td>{ord.zipCode}</td>
                  <td>${ord.shippingCost}</td>
                  <td>{ord.paymentMethod}</td>
                  <td>
                    <Form.Select
                      value={ord.status}
                      onChange={(e) =>
                        handleStatusChange(ord._id, e.target.value)
                      }
                    >
                      {["pending", "processing", "delivered", "cancel"].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        )
                      )}
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderList;
