import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddProductForm.css';

const AddProductForm = ({ onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [""]
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image input changes
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...newProduct.images];
    newImages[index] = value;
    setNewProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // Add new image input field
  const addImageField = () => {
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  // Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        images: [""]
      });
      onProductAdded(); // Callback to refresh the products list
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h2>Add New Product</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="description"
        placeholder="Product Description"
        value={newProduct.description}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleInputChange}
        required
      />
      {newProduct.images.map((image, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Image URL ${index + 1}`}
          value={image}
          onChange={(e) => handleImageChange(e, index)}
          required
        />
      ))}
      <button type="button" onClick={addImageField}>
        Add Another Image
      </button>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm; 