import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts, fetchCategories } from "../../redux/ecomSlice"; // Adjust the import path as necessary

const AdminPanel = () => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productPrice, setProductPrice] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productBadge, setProductBadge] = useState(false);
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productPdf, setProductPdf] = useState(null);
  const [productSpecifications, setProductSpecifications] = useState([
    { label: "", value: "" },
  ]);

  const [categoryName, setCategoryName] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const getCategory = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/category/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const categories = await response.json();
      setAllCategories(categories);
      dispatch(fetchCategories());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const getProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProducts(data);
      dispatch(fetchProducts());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getCategory();
    getProducts();
  }, [getCategory, getProducts]);

  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...productSpecifications];
    newSpecifications[index][field] = value;
    setProductSpecifications(newSpecifications);
  };

  const addSpecification = () => {
    setProductSpecifications([...productSpecifications, { label: "", value: "" }]);
  };

  const removeSpecification = (index) => {
    const newSpecifications = productSpecifications.filter(
      (_, specIndex) => specIndex !== index
    );
    setProductSpecifications(newSpecifications);
  };

  const handleImageUpload = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handlePdfUpload = (e) => {
    setProductPdf(e.target.files[0]);
  };

  const addProduct = async () => {
    try {
      const productData = {
        name: productName,
        image: productImage ? productImage : "no image available",
        price: productPrice,
        color: productColor ? productColor : "unknown color",
        badge: productBadge ? productBadge : false,
        description: productDescription ? productDescription : "no description for product",
        category: productCategory,
        brand: productBrand ? productBrand : "unknown brand",
        pdf: productPdf ? productPdf : "Details soon...",
        specifications: productSpecifications,
      };

      const response = await fetch("http://localhost:5000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to add product: ${errorDetails.message}`);
      }

      const newProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      dispatch(fetchProducts());

      // Reset form fields after successful product addition
      setProductName("");
      setProductImage(null);
      setProductPrice("");
      setProductColor("");
      setProductBadge(false);
      setProductDescription("");
      setProductCategory("");
      setProductBrand("");
      setProductPdf(null);
      setProductSpecifications([{ label: "", value: "" }]);
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const addCategory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/category/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });
      const newCategory = await response.json();
      setAllCategories((prevCategories) => [...prevCategories, newCategory]);
      dispatch(fetchCategories());
      setCategoryName("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      console.log(json);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      dispatch(fetchProducts());
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async (id) => {
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("image", productImage);
    formData.append("price", productPrice);
    formData.append("color", productColor);
    formData.append("badge", productBadge);
    formData.append("description", productDescription);
    formData.append("category", productCategory);
    formData.append("brand", productBrand);
    formData.append("pdf", productPdf);
    formData.append("specifications", JSON.stringify(productSpecifications));

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === id ? updatedProduct : product))
      );
      dispatch(fetchProducts());
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/category/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      console.log(json);
      setAllCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
      dispatch(fetchCategories());
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });
      const updatedCategory = await response.json();
      setAllCategories((prevCategories) =>
        prevCategories.map((category) => (category._id === id ? updatedCategory : category))
      );
      dispatch(fetchCategories());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-white to-gray-400">
      <div className="mb-8 mr-14 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Add Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="border p-2 w-full"
            />
          </div>
          <div className="col-span-1">
            <input
              type="file"
              onChange={handleImageUpload}
              placeholder="Product Image"
              className="border p-2 w-full"
            />
          </div>
          <div className="col-span-1">
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Product Price"
              className="border p-2 w-full"
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              value={productColor}
              onChange={(e) => setProductColor(e.target.value)}
              placeholder="Product Color"
              className="border p-2 w-full"
            />
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={productBadge}
                onChange={(e) => setProductBadge(e.target.checked)}
                className="border p-2"
              />
              <span>Has Badge</span>
            </label>
          </div>
          <div className="col-span-2">
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Product Description"
              className="border p-2 w-full"
            />
          </div>
          <div className="col-span-1">
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select Category</option>
              {allCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              placeholder="Product Brand"
              className="border p-2 w-full"
            />
          </div>
          <div className="col-span-1">
            <input
              type="file"
              onChange={handlePdfUpload}
              placeholder="Product PDF"
              className="border p-2 w-full"
            />
          </div>
          <div className="my-4">
            <h3 className="text-lg mb-2">Product Specifications</h3>
            {productSpecifications.map((spec, index) => (
              <div key={index} className="mb-2 flex items-center space-x-4">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) =>
                    handleSpecificationChange(index, "label", e.target.value)
                  }
                  placeholder="Specification Label"
                  className="border p-2 w-1/2"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecificationChange(index, "value", e.target.value)
                  }
                  placeholder="Specification Value"
                  className="border p-2 w-1/2"
                />
                <button
                  onClick={() => removeSpecification(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addSpecification}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Specification
            </button>
          </div>

          <button
            onClick={addProduct}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 mr-14 bg-white rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Add Category</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="border p-2 w-1/2"
          />
          <button
            onClick={addCategory}
            className="bg-blue-500 text-white p-2 ml-4 rounded"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 mr-14 bg-white rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Manage Products</h2>
        {products.map((product) => (
          <div key={product._id} className="flex items-center justify-between mb-2">
            <span>{product.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => updateProduct(product._id)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 p-4 mr-14 bg-white rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Manage Categories</h2>
        {allCategories.map((category) => (
          <div key={category._id} className="flex items-center justify-between mb-2">
            <span>{category.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => updateCategory(category._id)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => deleteCategory(category._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
