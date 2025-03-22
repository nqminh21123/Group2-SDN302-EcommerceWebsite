import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import {
  FaTag,
  FaBarcode,
  FaDollarSign,
  FaPercent,
  FaBoxes,
  FaInfo,
  FaList,
  FaTags,
  FaChartLine,
  FaPalette,
  FaImage,
  FaPlus,
  FaTrash,
  FaCheck,
  FaUpload,
  FaSpeakap,
  FaThList,
} from "react-icons/fa";

const AddProduct = () => {
  const [product, setProduct] = useState({
    brand: { name: "", id: "" },
    category: { name: "", id: "" },
    sku: "",
    img: "",
    title: "",
    slug: "",
    unit: "",
    parent: "",
    children: "",
    price: 0,
    discount: 0,
    quantity: 0,
    status: "in-stock",
    productType: "",
    description: "",
    featured: false,
    sellCount: 0,
    tags: [],
    additionalInformation: [{ key: "", value: "" }],
    imageURLs: [{ color: { name: "", clrCode: "" }, img: "" }],
  });

  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [children, setChildren] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/brand/all");
        console.log(res.data.result);
        setBrand(res.data?.result);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCategory = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/category/all");
        setCategory(res.data?.result);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    };
    fetchBrand();
    fetchCategory();
  }, []);

  const [tag, setTag] = useState("");
  const [colorKey, setColorKey] = useState("");
  const [colorValue, setColorValue] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState("");
  const [isUploadingProduct, setIsUploadingProduct] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    const selectedCate = category.find((ca) => ca._id === value);
    setProduct({
      ...product,
      [name]: selectedCate.parent,
      category: { name: selectedCate.parent, id: value },
      parent: selectedCate.parent,
      children: "",
    });
    setChildren(selectedCate?.children || []);
  };

  const handleChangeBrand = (e) => {
    const { value } = e.target;
    const selectedBrand = brand.find((bra) => bra._id === value);
    setProduct({
      ...product,
      brand: { id: selectedBrand._id, name: selectedBrand.name },
    });
  };

  const handleAddTag = () => {
    if (tag.trim()) {
      setProduct({ ...product, tags: [...product.tags, tag.trim()] });
      setTag("");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...product.tags];
    updatedTags.splice(index, 1);
    setProduct({ ...product, tags: updatedTags });
  };

  const handleAddColor = () => {
    if (colorKey.trim() && colorValue.trim()) {
      const newColor = {
        color: { name: colorKey, clrCode: colorValue },
        img: "",
      };
      setProduct({
        ...product,
        imageURLs: [...product.imageURLs, newColor],
      });
      setColorKey("");
      setColorValue("");
    }
  };

  const handleColorImgChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedColors = [...product.imageURLs];
      updatedColors[index].file = file;
      setProduct({ ...product, imageURLs: updatedColors });
    }
  };

  const handleUploadImg = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:9999/api/cloudinary/add-img",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", res.data);
      return res.data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleUploadSingleImage = async (index) => {
    const colorItem = product.imageURLs[index];
    if (!colorItem.file) {
      alert("Please select an image file first");
      return;
    }

    setIsUploading(true);
    setUploadingIndex(index);

    try {
      const imageUrl = await handleUploadImg(colorItem.file);
      if (imageUrl) {
        const updatedColors = [...product.imageURLs];
        updatedColors[index].img = imageUrl;
        delete updatedColors[index].file;
        setProduct({ ...product, imageURLs: updatedColors });
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
    }
  };

  const handleProductImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  // Add a function to upload the product image
  const handleUploadProductImage = async () => {
    if (!productImage) {
      alert("Please select an image first");
      return;
    }

    setIsUploadingProduct(true);

    try {
      const imageUrl = await handleUploadImg(productImage);
      if (imageUrl) {
        setProductImageUrl(imageUrl);
        setProduct({ ...product, img: imageUrl });
        alert("Product image uploaded successfully!");
      } else {
        alert("Failed to upload product image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading product image:", error);
      alert("Error uploading product image. Please try again.");
    } finally {
      setIsUploadingProduct(false);
    }
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...product.imageURLs];
    updatedColors.splice(index, 1);
    setProduct({ ...product, imageURLs: updatedColors });
  };

  const handleAddInfo = () => {
    setProduct({
      ...product,
      additionalInformation: [
        ...product.additionalInformation,
        { key: "", value: "" },
      ],
    });
  };

  const handleInfoChange = (index, field, value) => {
    const updatedInfo = [...product.additionalInformation];
    updatedInfo[index][field] = value;
    setProduct({ ...product, additionalInformation: updatedInfo });
  };

  const handleRemoveInfo = (index) => {
    const updatedInfo = [...product.additionalInformation];
    updatedInfo.splice(index, 1);
    setProduct({ ...product, additionalInformation: updatedInfo });
  };

  const validateImageUrls = () => {
    // Check if all images have been uploaded (have URLs)
    for (let i = 0; i < product.imageURLs.length; i++) {
      if (product.imageURLs[i].file && !product.imageURLs[i].img) {
        alert(
          `Please upload the image for ${
            product.imageURLs[i].color.name || "unnamed color"
          } before submitting`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateImageUrls()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:9999/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const result = await response.json();

      if (result.success) {
        console.log(
          `Product created successfully with SKU: ${result.data.sku}`
        );
        return result.data;
      } else {
        console.error(`Failed to add product: ${result.message}`);
        return null;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">Add New Product</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Column */}
              <Col md={6}>
                <h4 className="border-bottom pb-2 mb-3">Basic Information</h4>

                {/* Brand */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaTag className="me-2" />
                    Brand
                  </Form.Label>
                  <Form.Select
                    name="brand"
                    value={product.brand.id}
                    onChange={handleChangeBrand}
                  >
                    <option value="">Select Brand</option>
                    {brand.map((bra, index) => (
                      <option key={index} value={bra._id}>
                        {bra.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3">
                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaList className="me-2" />
                          Parent Category
                        </Form.Label>
                        <Form.Select
                          name="parent"
                          onChange={handleParentChange}
                        >
                          <option value="">Select Parent Category</option>
                          {category.map((ca, index) => (
                            <option key={index} value={ca._id}>
                              {ca.parent}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaList className="me-2" />
                          Child Category
                        </Form.Label>
                        <Form.Select
                          onChange={handleInputChange}
                          name="children"
                          value={product.children}
                        >
                          <option value="">Select Child Category</option>
                          {children.map((ca, index) => (
                            <option key={index} value={ca}>
                              {ca}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form.Group>

                {/* SKU */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBarcode className="me-2" />
                    SKU
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={product.sku}
                    placeholder="SKU"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaImage className="me-2" />
                    Image
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="file"
                      onChange={handleProductImageChange}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={handleUploadProductImage}
                      disabled={isUploadingProduct || !productImage}
                    >
                      {isUploadingProduct ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        <>
                          <FaUpload className="me-1" /> Upload
                        </>
                      )}
                    </Button>
                  </InputGroup>
                  {productImageUrl && (
                    <div className="mt-2">
                      <img
                        src={productImageUrl}
                        alt="Product Preview"
                        style={{ maxHeight: "100px" }}
                        className="border p-1"
                      />
                      <div className="mt-1">
                        <small className="text-success">
                          <FaCheck className="me-1" />
                          Image Uploaded
                        </small>
                      </div>
                    </div>
                  )}
                </Form.Group>

                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaInfo className="me-2" />
                    Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={product.title}
                    placeholder="Product Title"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {/* Slug */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaInfo className="me-2" />
                    Slug
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={product.slug}
                    placeholder="product-slug"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {/* Unit */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaInfo className="me-2" />
                    Unit
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    value={product.unit}
                    placeholder="Unit (e.g. 3pcs)"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {/* Price & Discount */}
                <Row>
                  <Col sm={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaDollarSign className="me-2" />
                        Price
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={product.price}
                        placeholder="Price"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaPercent className="me-2" />
                        Discount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="discount"
                        value={product.discount}
                        placeholder="Discount %"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaSpeakap className="me-2" />
                        SellCount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="sellCount"
                        value={product.sellCount}
                        placeholder="Sell Count"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBoxes className="me-2" />
                        Quantity
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        placeholder="Quantity"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Status & Type */}
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaInfo className="me-2" />
                        Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={product.status}
                        onChange={handleInputChange}
                      >
                        <option value="in-stock">In Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                        <option value="coming-soon">Coming Soon</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaInfo className="me-2" />
                        Product Type
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="productType"
                        value={product.productType}
                        placeholder="Product Type"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Featured */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="featured"
                    label="Featured Product"
                    name="featured"
                    checked={product.featured}
                    onChange={(e) =>
                      setProduct({ ...product, featured: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <h4 className="border-bottom pb-2 mb-3">Details & Images</h4>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaInfo className="me-2" />
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={product.description}
                    placeholder="Product Description"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {/* Tags */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaTags className="me-2" />
                    Tags
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Add a tag"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                    <Button variant="outline-secondary" onClick={handleAddTag}>
                      <FaPlus /> Add
                    </Button>
                  </InputGroup>
                  <div className="mt-2">
                    {product.tags.map((tag, index) => (
                      <Button
                        key={index}
                        variant="info"
                        size="sm"
                        className="me-2 mb-2"
                      >
                        {tag}
                        <span
                          className="ms-2"
                          onClick={() => handleRemoveTag(index)}
                          style={{ cursor: "pointer" }}
                        >
                          ✕
                        </span>
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                {/* Colors & Images */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaPalette className="me-2" />
                    Colors & Images
                  </Form.Label>
                  <Row>
                    <Col sm={5}>
                      <Form.Control
                        type="text"
                        placeholder="Color Name"
                        value={colorKey}
                        onChange={(e) => setColorKey(e.target.value)}
                        className="mb-2"
                      />
                    </Col>
                    <Col sm={5}>
                      <Form.Control
                        type="text"
                        placeholder="Color Code (e.g. #FFFFFF)"
                        value={colorValue}
                        onChange={(e) => setColorValue(e.target.value)}
                        className="mb-2"
                      />
                    </Col>
                    <Col sm={2}>
                      <Button
                        variant="outline-secondary"
                        onClick={handleAddColor}
                        className="w-100"
                      >
                        <FaPlus />
                      </Button>
                    </Col>
                  </Row>

                  {product.imageURLs.map((item, index) => (
                    <Card key={index} className="mt-2 p-2">
                      <Row>
                        <Col sm={3}>
                          <div
                            className="color-preview mb-2"
                            style={{
                              backgroundColor: item.color.clrCode,
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              border: "1px solid #ccc",
                            }}
                          />
                          <small>{item.color.name}</small>
                        </Col>
                        <Col sm={5}>
                          <Form.Control
                            type="file"
                            onChange={(e) => handleColorImgChange(index, e)}
                            size="sm"
                          />
                          {item.img && (
                            <div className="mt-1">
                              <small className="text-success">
                                <FaCheck className="me-1" />
                                Uploaded
                              </small>
                            </div>
                          )}
                        </Col>
                        <Col sm={2}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleUploadSingleImage(index)}
                            disabled={isUploading && uploadingIndex === index}
                            className="w-100"
                          >
                            {isUploading && uploadingIndex === index ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              <FaImage />
                            )}
                          </Button>
                        </Col>
                        <Col sm={2}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveColor(index)}
                            className="w-100"
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Form.Group>

                {/* Additional Information */}
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex justify-content-between align-items-center">
                    <span>
                      <FaThList className="me-2" />
                      Additional Information
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddInfo}
                    >
                      <FaPlus /> Add Field
                    </Button>
                  </Form.Label>

                  {product.additionalInformation.map((info, index) => (
                    <Card key={index} className="mb-2 p-2">
                      <Row>
                        <Col sm={5}>
                          <Form.Control
                            type="text"
                            placeholder="Key"
                            value={info.key}
                            onChange={(e) =>
                              handleInfoChange(index, "key", e.target.value)
                            }
                            size="sm"
                          />
                        </Col>
                        <Col sm={5}>
                          <Form.Control
                            type="text"
                            placeholder="Value"
                            value={info.value}
                            onChange={(e) =>
                              handleInfoChange(index, "value", e.target.value)
                            }
                            size="sm"
                          />
                        </Col>
                        <Col sm={2}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveInfo(index)}
                            className="w-100"
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Form.Group>
              </Col>
            </Row>

            {/* Submit Button */}
            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" type="submit" size="lg">
                Add Product
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;
