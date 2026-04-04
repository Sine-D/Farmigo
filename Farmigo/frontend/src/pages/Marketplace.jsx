import React, { useState, useContext } from 'react';
import {
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaLeaf,
  FaTruck,
  FaStore,
  FaStar,
} from 'react-icons/fa';

import product1 from "../assets/images/tomatoes.jpg";
import product2 from "../assets/images/potatoes.jpeg";
import product3 from "../assets/images/dairy.jpeg";
import './Marketplace.css';
import { CartContext } from "../context/CartContext";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart, cartItems } = useContext(CartContext);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Rajesh Farms",
      price: 45,
      storage: "GreenCold Storage (5km)",
      rating: 4.5,
      image: product1,
      category: "vegetables",
      harvestDate: "2 days ago"
    },
    {
      id: 2,
      name: "Fresh Potatoes",
      farmer: "Singh Agri",
      price: 30,
      storage: "AgriFresh (12km)",
      rating: 4.2,
      image: product2,
      category: "vegetables",
      harvestDate: "1 day ago"
    },
    {
      id: 3,
      name: "Buffalo Milk",
      farmer: "Dairy Bliss",
      price: 60,
      storage: "ChillZone (8km)",
      rating: 4.7,
      image: product3,
      category: "dairy",
      harvestDate: "Today"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'all' || product.category === activeCategory)
  );

  return (
    <section className="marketplace-section" id='market'>
      <div className="marketplace-container">
        {/* Header */}
        <div className="marketplace-header">
          <h1>Farm Fresh Marketplace <FaLeaf className="icon" /></h1>
          <p>Connect directly with farmers and access produce stored in nearby cold storages</p>
        </div>

        {/* Search and Filters */}
        <div className="marketplace-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products (tomatoes, milk, etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            <button
              className={`btn-modern ${activeCategory === 'all' ? 'btn-modern-primary' : 'btn-modern-secondary'}`}
              onClick={() => setActiveCategory('all')}
            >
              <FaStore /> All
            </button>
            <button
              className={`btn-modern ${activeCategory === 'vegetables' ? 'btn-modern-primary' : 'btn-modern-secondary'}`}
              onClick={() => setActiveCategory('vegetables')}
            >
              <FaLeaf /> Vegetables
            </button>
            <button
              className={`btn-modern ${activeCategory === 'dairy' ? 'btn-modern-primary' : 'btn-modern-secondary'}`}
              onClick={() => setActiveCategory('dairy')}
            >
              <FaTruck /> Dairy
            </button>
            <button className="btn-modern btn-modern-primary ms-2">
              <FaShoppingCart /> Cart ({cartItems.length})
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge">
                    <FaStar /> {product.rating}
                  </div>
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="farmer">By {product.farmer}</p>
                  <div className="product-meta">
                    <span className="price">₹{product.price}/unit</span>
                    <span className="storage">{product.storage}</span>
                  </div>
                  <p className="harvest-date">Harvested: {product.harvestDate}</p>
                  <button
                    className="btn-modern btn-modern-primary w-100 mt-2"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products found matching your search</p>
              <button
                className="btn-modern btn-modern-secondary mt-3"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
