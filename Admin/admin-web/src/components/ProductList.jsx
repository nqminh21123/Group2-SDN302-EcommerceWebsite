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
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/product/all");
        const data = res.data?.data;
        console.log(data);

        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = [
          ...new Set(data.map((item) => item.category.name)),
        ];
        const uniqueBrands = [...new Set(data.map((item) => item.brand.name))];

        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (product) => product.category.name === selectedCategory
      );
    }

    if (selectedBrand) {
      result = result.filter((product) => product.brand.name === selectedBrand);
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (statusFilter) {
      result = result.filter((product) => product.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortField === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortField === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === "quantity") {
        return sortDirection === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      } else if (sortField === "sellCount") {
        return sortDirection === "asc"
          ? a.sellCount - b.sellCount
          : b.sellCount - a.sellCount;
      }
      return 0;
    });

    setFilteredProducts(result);
  }, [
    products,
    searchTerm,
    sortField,
    sortDirection,
    selectedCategory,
    selectedBrand,
    priceRange,
    statusFilter,
  ]);

  const handleSort = (field) => {
    const direction =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: 0, max: 1000 });
    setStatusFilter("");
    setSortField("title");
    setSortDirection("asc");
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const deleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setShowDeleteModal(false);
    }
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  // Render loading state
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang tải dữ liệu sản phẩm...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Quản lý sản phẩm</h2>
          <p className="text-muted">Tổng số: {products.length} sản phẩm</p>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            className="d-flex align-items-center"
            as={Link}
            to={"/products/add"}
          >
            <FaPlus className="me-2" /> Thêm sản phẩm mới
          </Button>
        </Col>
      </Row>

      {/* Filters section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4} className="mb-3 mb-md-0">
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo tên sản phẩm hoặc SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={3} className="mb-2 mb-md-0">
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3} className="mb-2 mb-md-0">
                  <Form.Select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand, index) => (
                      <option key={index} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3} className="mb-2 mb-md-0">
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="in-stock">Còn hàng</option>
                    <option value="out-of-stock">Hết hàng</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="d-flex justify-content-end">
                  <Button variant="outline-secondary" onClick={resetFilters}>
                    Đặt lại bộ lọc
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th style={{ width: "80px" }}>Hình ảnh</th>
                <th
                  onClick={() => handleSort("title")}
                  style={{ cursor: "pointer" }}
                >
                  Tên sản phẩm{" "}
                  {sortField === "title" &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountUp size={14} />
                    ) : (
                      <FaSortAmountDown size={14} />
                    ))}
                </th>
                <th>SKU</th>
                <th>Danh mục</th>
                <th>Thương hiệu</th>
                <th
                  onClick={() => handleSort("price")}
                  style={{ cursor: "pointer" }}
                >
                  Giá{" "}
                  {sortField === "price" &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountUp size={14} />
                    ) : (
                      <FaSortAmountDown size={14} />
                    ))}
                </th>
                <th>Giảm giá</th>
                <th
                  onClick={() => handleSort("quantity")}
                  style={{ cursor: "pointer" }}
                >
                  Tồn kho{" "}
                  {sortField === "quantity" &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountUp size={14} />
                    ) : (
                      <FaSortAmountDown size={14} />
                    ))}
                </th>
                <th>Trạng thái</th>
                <th
                  onClick={() => handleSort("sellCount")}
                  style={{ cursor: "pointer" }}
                >
                  Đã bán{" "}
                  {sortField === "sellCount" &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountUp size={14} />
                    ) : (
                      <FaSortAmountDown size={14} />
                    ))}
                </th>
                <th style={{ width: "120px" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.img}
                        alt={product.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="rounded"
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>
                      <code>{product.sku}</code>
                    </td>
                    <td>{product.category.name}</td>
                    <td>{product.brand.name}</td>
                    <td>
                      {product.discount > 0 ? (
                        <div>
                          <span className="text-danger fw-bold">
                            $
                            {getDiscountedPrice(
                              product.price,
                              product.discount
                            )}
                          </span>
                          <span className="text-muted text-decoration-line-through ms-2">
                            ${product.price}
                          </span>
                        </div>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </td>
                    <td>
                      {product.discount > 0 ? (
                        <Badge bg="danger">{product.discount}%</Badge>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>{product.quantity}</td>
                    <td>
                      {product.status === "in-stock" ? (
                        <Badge bg="success">Còn hàng</Badge>
                      ) : (
                        <Badge bg="danger">Hết hàng</Badge>
                      )}
                    </td>
                    <td>{product.sellCount}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="light"
                          size="sm"
                          id={`dropdown-${product._id}`}
                        >
                          Thao tác
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            as={Link}
                            to={`/products/view/${product._id}`}
                            state={{ product }}
                          >
                            <FaSearch className="me-2" /> Xem chi tiết
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => confirmDelete(product)}
                          >
                            <FaTrash className="me-2" /> Xóa
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    <p className="mb-0">
                      Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.
                    </p>
                    <Button variant="link" onClick={resetFilters}>
                      Xóa bộ lọc
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="bg-white">
          <Row className="align-items-center">
            <Col>
              <small className="text-muted">
                Hiển thị {currentProducts.length} trên tổng số{" "}
                {filteredProducts.length} sản phẩm
              </small>
            </Col>
            <Col xs="auto">
              <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {[...Array(totalPages).keys()].map((number) => {
                  // Only show limited page numbers around current page
                  if (
                    number + 1 === 1 ||
                    number + 1 === totalPages ||
                    (number + 1 >= currentPage - 1 &&
                      number + 1 <= currentPage + 1)
                  ) {
                    return (
                      <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => paginate(number + 1)}
                      >
                        {number + 1}
                      </Pagination.Item>
                    );
                  } else if (
                    number + 1 === currentPage - 2 ||
                    number + 1 === currentPage + 2
                  ) {
                    return <Pagination.Ellipsis key={`ellipsis-${number}`} />;
                  }
                  return null;
                })}

                <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <>
              <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
              <div className="d-flex align-items-center p-2 bg-light rounded">
                <img
                  src={productToDelete.img}
                  alt={productToDelete.title}
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  className="rounded me-3"
                />
                <div>
                  <div className="fw-bold">{productToDelete.title}</div>
                  <small className="text-muted">
                    SKU: {productToDelete.sku}
                  </small>
                </div>
              </div>
              <p className="mt-3 mb-0 text-danger">
                <small>Lưu ý: Hành động này không thể hoàn tác.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={deleteProduct}>
            Xóa sản phẩm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList;
