import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Tabs,
  Tab,
  Button,
  Form,
  InputGroup,
  Image,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faUndo,
  faBoxOpen,
  faChartLine,
  faTag,
  faImage,
  faFileExport,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const ProductManagement = () => {
  const location = useLocation();
  const product1 = location.state?.product;
  const [product, setProduct] = useState(product1);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProduct({ ...product });
  };

  // Hàm xử lý khi lưu thay đổi
  const handleSave = () => {
    setProduct({ ...editedProduct });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDiscountedPrice = (price, discount) => {
    return ((price * (100 - discount)) / 100).toFixed(2);
  };

  return (
    <Container fluid className="py-4">
      {/* Tiêu đề trang */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">
            Quản Lý Sản Phẩm
            {isEditing ? (
              <span className="ms-2">
                <Button
                  variant="success"
                  className="ms-2"
                  size="sm"
                  onClick={handleSave}
                >
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  size="sm"
                  onClick={handleCancel}
                >
                  <FontAwesomeIcon icon={faUndo} /> Hủy
                </Button>
              </span>
            ) : (
              <Button
                variant="primary"
                className="ms-2"
                size="sm"
                onClick={handleEdit}
              >
                <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
              </Button>
            )}
          </h2>
        </Col>
      </Row>

      {/* Thông tin chung */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Thông Tin Cơ Bản</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Tên Sản Phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={isEditing ? editedProduct.title : product.title}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Thương Hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.brand.name}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Danh Mục</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.category.name}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mã SKU</Form.Label>
                  <Form.Control type="text" value={product.sku} disabled />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Giá Bán ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={isEditing ? editedProduct.price : product.price}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Giảm Giá (%)</Form.Label>
                      <Form.Control
                        type="number"
                        name="discount"
                        value={
                          isEditing ? editedProduct.discount : product.discount
                        }
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Giá Sau Giảm</Form.Label>
                  <Form.Control
                    type="text"
                    value={`$${calculateDiscountedPrice(
                      product.price,
                      product.discount
                    )}`}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Số Lượng Tồn Kho</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={
                      isEditing ? editedProduct.quantity : product.quantity
                    }
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn Vị</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    value={isEditing ? editedProduct.unit : product.unit}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tình Trạng</Form.Label>
                  <Form.Select
                    name="status"
                    value={isEditing ? editedProduct.status : product.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="in-stock">Còn Hàng</option>
                    <option value="out-of-stock">Hết Hàng</option>
                    <option value="discontinued">Ngừng Kinh Doanh</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hình Ảnh & Màu Sắc</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {product.imageURLs.map((item, index) => (
                  <Col md={3} key={item._id} className="mb-3">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={item.img}
                        alt={item?.color?.name || ""}
                      />
                      <Card.Body className="p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{item?.color?.name}</span>
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: item?.color?.clrCode,
                              borderRadius: "50%",
                              border: "1px solid #ddd",
                            }}
                          ></div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                <Col md={3}>
                  <Card className="h-100 d-flex justify-content-center align-items-center">
                    <Button variant="light" className="w-100 h-100">
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="mb-2"
                        size="lg"
                      />
                      <div>Thêm Hình Ảnh</div>
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Thông Số Kỹ Thuật</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Thuộc Tính</th>
                    <th>Giá Trị</th>
                    {isEditing && <th>Hành Động</th>}
                  </tr>
                </thead>
                <tbody>
                  {product.additionalInformation.map((info, index) => (
                    <tr key={index}>
                      <td>{info.key}</td>
                      <td>
                        {isEditing ? (
                          <Form.Control
                            type="text"
                            value={
                              editedProduct.additionalInformation[index].value
                            }
                            onChange={(e) => {
                              const newInfo = [
                                ...editedProduct.additionalInformation,
                              ];
                              newInfo[index].value = e.target.value;
                              setEditedProduct({
                                ...editedProduct,
                                additionalInformation: newInfo,
                              });
                            }}
                            size="sm"
                          />
                        ) : (
                          info.value
                        )}
                      </td>
                      {isEditing && (
                        <td>
                          <Button variant="danger" size="sm">
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {isEditing && (
                    <tr>
                      <td colSpan="3">
                        <Button variant="success" size="sm" className="w-100">
                          <FontAwesomeIcon icon={faPlus} /> Thêm Thông Số
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs thông tin chi tiết */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Thông Tin Chi Tiết</h5>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="description" className="mb-3">
                <Tab eventKey="description" title="Mô Tả Sản Phẩm">
                  {isEditing ? (
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        name="description"
                        value={editedProduct.description}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  ) : (
                    <div>
                      {product.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  )}
                </Tab>
                <Tab eventKey="reviews" title="Đánh Giá">
                  <h5>Đánh Giá Sản Phẩm ({product.reviews.length})</h5>
                  <hr />
                  {product.reviews.map((review) => (
                    <Card key={review._id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>Người Dùng: {review.userId}</h6>
                            <div className="mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-${
                                    i < review.rating ? "warning" : "secondary"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Button variant="outline-danger" size="sm">
                              <FontAwesomeIcon icon={faTrash} /> Xóa
                            </Button>
                          </div>
                        </div>
                        <p className="mb-0">{review.comment}</p>
                      </Card.Body>
                    </Card>
                  ))}
                </Tab>
                <Tab eventKey="tags" title="Tags">
                  <Form.Group>
                    <Form.Label>Tags Sản Phẩm</Form.Label>
                    <div className="d-flex flex-wrap mb-3">
                      {product.tags.map((tag, index) => (
                        <Badge
                          bg="primary"
                          className="me-2 mb-2 p-2"
                          key={index}
                        >
                          {tag}
                          {isEditing && (
                            <span
                              className="ms-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                const newTags = [...editedProduct.tags];
                                newTags.splice(index, 1);
                                setEditedProduct({
                                  ...editedProduct,
                                  tags: newTags,
                                });
                              }}
                            >
                              ×
                            </span>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <InputGroup className="mb-2" style={{ width: "300px" }}>
                          <Form.Control
                            placeholder="Thêm tag mới"
                            id="newTag"
                          />
                          <Button
                            variant="outline-secondary"
                            id="button-addon2"
                          >
                            Thêm
                          </Button>
                        </InputGroup>
                      )}
                    </div>
                  </Form.Group>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Các hành động quản lý */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Hành Động</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="primary">
                  <FontAwesomeIcon icon={faEdit} className="me-1" /> Chỉnh Sửa
                </Button>
                <Button variant="info">
                  <FontAwesomeIcon icon={faBoxOpen} className="me-1" /> Cập Nhật
                  Kho
                </Button>
                <Button variant="success">
                  <FontAwesomeIcon icon={faChartLine} className="me-1" /> Thống
                  Kê
                </Button>
                <Button variant="warning">
                  <FontAwesomeIcon icon={faTag} className="me-1" /> Khuyến Mãi
                </Button>
                <Button variant="secondary">
                  <FontAwesomeIcon icon={faImage} className="me-1" /> Quản Lý
                  Hình Ảnh
                </Button>
                <Button variant="dark">
                  <FontAwesomeIcon icon={faComments} className="me-1" /> Đánh
                  Giá
                </Button>
                <Button variant="outline-primary">
                  <FontAwesomeIcon icon={faFileExport} className="me-1" /> Xuất
                  Dữ Liệu
                </Button>
                <Button variant="danger">
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Xóa Sản
                  Phẩm
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductManagement;
