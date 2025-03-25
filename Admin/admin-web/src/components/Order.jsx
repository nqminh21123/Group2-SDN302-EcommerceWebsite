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
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error(" Error updating status:", error);

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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((ord, index) => (
                <tr key={ord._id}>
                  <td>{`ORD_${index + 1}`}</td>
                  <td>{ord.name}</td>
                  <td>{ord.zipCode}</td>
                  <td>${ord.shippingCost}</td>
                  <td>{ord.paymentMethod}</td>
                  <td>
                    <Form.Select
                      variant="light"
                      className="p-2 h-30 w-50"
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
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowModal(ord)}
                    >
                      <FaSearch className="me-2 mb-1" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="bg-white">
          <Row className="align-items-center">
            <Col>
              <small className="text-muted">
                Display: {currentOrders.length} orders
              </small>
            </Col>
            <Col xs="auto">
              <Pagination className="justify-content-center mt-3">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p>
                <strong>Order ID:</strong> ORD#{selectedOrder.invoice}
              </p>
              <p>
                <strong>Name:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedOrder.contact}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address},{" "}
                {selectedOrder.city}, {selectedOrder.country}
              </p>
              <p>
                <strong>Zip Code:</strong> {selectedOrder.zipCode}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </p>
              <p>
                <strong>Shipping Cost:</strong> ${selectedOrder.shippingCost}
              </p>
              <p>
                <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
              </p>
              <p>
                <strong>Order Note:</strong>{" "}
                {selectedOrder.orderNote || "No note provided"}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <h5 className="mt-3">Cart Items:</h5>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.cart.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={item.img}
                          alt={item.title || "Product image"}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderList;
