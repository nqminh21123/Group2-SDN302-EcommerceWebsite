import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { FaCopy, FaCheck, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    logo: "",
    couponCode: "",
    endTime: "",
    discountPercentage: 0,
    minimumAmount: 0,
    productType: "",
  });
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  // Get All coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/coupon");
      setCoupons(res.data);
    } catch (error) {
      console.log(error);
      showAlert("danger", "Failed to fetch coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Function to handle copy to clipboard
  const copyCouponCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCoupon(code);
        setTimeout(() => setCopiedCoupon(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Function to check if coupon is expired
  const isExpired = (endTime) => {
    return new Date(endTime) < new Date();
  };

  // Function to show alert
  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: "", message: "" }), 3000);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      logo: "",
      couponCode: "",
      endTime: "",
      discountPercentage: 0,
      minimumAmount: 0,
      productType: "",
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      title: coupon.title,
      logo: coupon.logo,
      couponCode: coupon.couponCode,
      endTime: formatDateForInput(coupon.endTime),
      discountPercentage: coupon.discountPercentage,
      minimumAmount: coupon.minimumAmount,
      productType: coupon.productType,
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteModal(true);
  };

  // Add coupon
  const addCoupon = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9999/api/coupon/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.message === "Coupon Added Successfully!")
        showAlert("success", "Add coupon successfully");
    } catch (error) {
      console.log(error);
      showAlert("danger", "Failed to add coupon");
    }
  };

  // Update coupon
  const updateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:9999/api/coupon/${selectedCoupon._id}`,
        formData
      );
      setShowEditModal(false);
      fetchCoupons();
      showAlert("success", "Coupon updated successfully");
    } catch (error) {
      console.log(error);
      showAlert("danger", "Failed to update coupon");
    }
  };

  // Delete coupon
  const deleteCoupon = async () => {
    try {
      await axios.delete(
        `http://localhost:9999/api/coupon/${selectedCoupon._id}`
      );
      setShowDeleteModal(false);
      fetchCoupons();
      showAlert("success", "Coupon deleted successfully");
    } catch (error) {
      console.log(error);
      showAlert("danger", "Failed to delete coupon");
    }
  };

  return (
    <Container className="py-5">
      {alert.show && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Coupons</h2>
        <Button variant="primary" onClick={openAddModal}>
          <FaPlus className="me-2" /> Add New Coupon
        </Button>
      </div>

      <Row>
        {coupons.map((coupon) => (
          <Col md={6} lg={4} className="mb-4" key={coupon._id}>
            <Card
              className={`h-100 shadow ${
                isExpired(coupon.endTime) ? "bg-light" : ""
              }`}
            >
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={coupon.logo}
                  className="p-3"
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <Badge
                  bg="danger"
                  className="position-absolute top-0 end-0 m-2"
                >
                  {coupon.discountPercentage}% OFF
                </Badge>
                <div className="position-absolute top-0 start-0 m-2">
                  <Button
                    variant="light"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(coupon)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteModal(coupon)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title>{coupon.title}</Card.Title>
                <Badge bg="info" className="mb-2 align-self-start">
                  {coupon.productType}
                </Badge>
                <Card.Text>
                  <small className="text-muted">
                    Minimum Purchase: ${coupon.minimumAmount}
                  </small>
                </Card.Text>
                <Card.Text>
                  <small
                    className={`${
                      isExpired(coupon.endTime) ? "text-danger" : "text-success"
                    }`}
                  >
                    {isExpired(coupon.endTime) ? "Expired on " : "Valid until "}
                    {formatDate(coupon.endTime)}
                  </small>
                </Card.Text>

                <div className="mt-auto">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={coupon.couponCode}
                      readOnly
                    />
                    <Button
                      variant={
                        copiedCoupon === coupon.couponCode
                          ? "success"
                          : "outline-secondary"
                      }
                      onClick={() => copyCouponCode(coupon.couponCode)}
                      disabled={isExpired(coupon.endTime)}
                    >
                      {copiedCoupon === coupon.couponCode ? (
                        <FaCheck />
                      ) : (
                        <FaCopy />
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {coupons.length === 0 && (
        <div className="text-center py-5">
          <h4>No coupons available at the moment</h4>
          <Button variant="primary" onClick={openAddModal} className="mt-3">
            Add Your First Coupon
          </Button>
        </div>
      )}

      {/* Add Coupon Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Coupon</Modal.Title>
        </Modal.Header>
        <Form onSubmit={addCoupon}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Coupon Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumAmount"
                    value={formData.minimumAmount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Coupon
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Coupon Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Coupon</Modal.Title>
        </Modal.Header>
        <Form onSubmit={updateCoupon}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Coupon Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumAmount"
                    value={formData.minimumAmount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Coupon
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the coupon "{selectedCoupon?.title}"?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteCoupon}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CouponList;
