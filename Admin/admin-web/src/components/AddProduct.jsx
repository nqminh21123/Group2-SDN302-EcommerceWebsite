import React, { useState } from "react";

const AddProduct = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    img: "",
    title: "",
    slug: "",
    unit: "",
    imageURLs: [{ color: { name: "", clrCode: "" }, img: "", sizes: [] }],
    parent: "",
    children: "",
    price: 0,
    discount: 0,
    quantity: 0,
    brand: { name: "", id: "" },
    category: { name: "", id: "" },
    status: "in-stock",
    reviews: [],
    productType: "",
    description: "",
    videoId: "",
    additionalInformation: [],
    tags: [],
    sizes: [],
    offerDate: { startDate: "", endDate: "" },
    featured: false,
    sellCount: 0,
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...product.imageURLs];
    updatedImages[index][field] = value;
    setProduct({ ...product, imageURLs: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(product);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            className="form-control"
            value={product.brand}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label>SKU</label>
          <input
            type="text"
            name="sku"
            className="form-control"
            value={product.sku}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label>Discount</label>
          <input
            type="number"
            name="discount"
            className="form-control"
            value={product.discount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            value={product.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label>Unit</label>
          <input
            type="text"
            name="unit"
            className="form-control"
            value={product.unit}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={product.description}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="form-control"
            value={product.tags}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-3">
        <h5>Product Images</h5>
        {product.imageURLs.map((imgObj, index) => (
          <div key={index} className="row mb-2">
            <div className="col-md-6">
              <label>Color Name</label>
              <input
                type="text"
                className="form-control"
                value={imgObj.color}
                onChange={(e) =>
                  handleImageChange(index, "color", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label>Image URL</label>
              <input
                type="text"
                className="form-control"
                value={imgObj.img}
                onChange={(e) =>
                  handleImageChange(index, "img", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
