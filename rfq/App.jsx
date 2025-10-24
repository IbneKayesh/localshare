import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Post from "./components/Post";
import TableView from "./components/TableView";
import { Button } from 'primereact/button';
import "./app.css";

export default function App() {
  const [view, setView] = useState(() => localStorage.getItem('postView') || 'grid');
  const [posts, setPosts] = useState([
    {
      order: "OD-250115-001",
      time: "2 hrs ago",
      shop: "We Fashion Shop",
      content: "T-Shirt, black, red, purple, v cuff, short and long ....",
      products: 3,
      customers: 10,
      orders: 14,
      user: "Mikel"
    },
    {
      order: "OD-250115-002",
      time: "5 hrs ago",
      shop: "We Fashion Shop",
      content: "Jeans Gabardin, Formal, Suite...",
      products: 16,
      customers: 34,
      orders: 120,
      user: "James"
    },
    {
      order: "OD-250116-005",
      time: "7 hrs ago",
      shop: "Mens Style Ltd",
      content: "Blanket, Suite, Pant, Holders, Formal shoes, Belt...",
      products: 98,
      customers: 480,
      orders: 1845,
      user: "Mark"
    },
    {
      order: "OD-250117-010",
      time: "1 hr ago",
      shop: "Urban Wear Co",
      content: "Hoodies, Joggers, Sneakers...",
      products: 25,
      customers: 67,
      orders: 89,
      user: "Sarah"
    },
    {
      order: "OD-250118-015",
      time: "3 hrs ago",
      shop: "Casual Corner",
      content: "Dresses, Skirts, Blouses...",
      products: 42,
      customers: 123,
      orders: 156,
      user: "Emma"
    },
    {
      order: "OD-250119-020",
      time: "6 hrs ago",
      shop: "Sporty Gear",
      content: "Running shoes, Tracksuits, Accessories...",
      products: 78,
      customers: 234,
      orders: 312,
      user: "Alex"
    },
    {
      order: "OD-250120-025",
      time: "8 hrs ago",
      shop: "Elegant Boutique",
      content: "Evening gowns, Jewelry, Handbags...",
      products: 15,
      customers: 45,
      orders: 67,
      user: "Lisa"
    },
    {
      order: "OD-250121-030",
      time: "10 hrs ago",
      shop: "Kids Fashion Hub",
      content: "Children's clothing, Toys, Accessories...",
      products: 89,
      customers: 345,
      orders: 456,
      user: "Tom"
    },
    {
      order: "OD-250122-035",
      time: "12 hrs ago",
      shop: "Tech Wear",
      content: "Smart clothing, Gadgets, Accessories...",
      products: 34,
      customers: 78,
      orders: 98,
      user: "Mike"
    },
    {
      order: "OD-250123-040",
      time: "14 hrs ago",
      shop: "Vintage Store",
      content: "Retro clothing, Accessories, Collectibles...",
      products: 56,
      customers: 167,
      orders: 203,
      user: "Anna"
    },
    {
      order: "OD-250124-045",
      time: "16 hrs ago",
      shop: "Outdoor Gear",
      content: "Hiking boots, Jackets, Camping equipment...",
      products: 67,
      customers: 289,
      orders: 378,
      user: "David"
    },
    {
      order: "OD-250125-050",
      time: "18 hrs ago",
      shop: "Luxury Brands",
      content: "Designer clothing, Bags, Shoes...",
      products: 23,
      customers: 56,
      orders: 78,
      user: "Sophia"
    },
    {
      order: "OD-250126-055",
      time: "20 hrs ago",
      shop: "Street Style",
      content: "Urban fashion, Sneakers, Accessories...",
      products: 45,
      customers: 134,
      orders: 167,
      user: "Ryan"
    },
    {
      order: "OD-250127-060",
      time: "22 hrs ago",
      shop: "Formal Attire",
      content: "Suits, Shirts, Ties, Dress shoes...",
      products: 38,
      customers: 98,
      orders: 124,
      user: "Olivia"
    },
    {
      order: "OD-250128-065",
      time: "1 day ago",
      shop: "Beach Wear",
      content: "Swimwear, Sandals, Sunglasses...",
      products: 29,
      customers: 76,
      orders: 95,
      user: "Jake"
    },
    {
      order: "OD-250129-070",
      time: "1 day ago",
      shop: "Winter Collection",
      content: "Coats, Boots, Scarves, Gloves...",
      products: 52,
      customers: 145,
      orders: 189,
      user: "Mia"
    },
    {
      order: "OD-250130-075",
      time: "1 day ago",
      shop: "Active Wear",
      content: "Yoga pants, Sports bras, Sneakers...",
      products: 61,
      customers: 203,
      orders: 267,
      user: "Ethan"
    },
    {
      order: "OD-250131-080",
      time: "2 days ago",
      shop: "Party Store",
      content: "Costumes, Party supplies, Accessories...",
      products: 74,
      customers: 256,
      orders: 334,
      user: "Zoe"
    },
    {
      order: "OD-250201-085",
      time: "2 days ago",
      shop: "Eco Fashion",
      content: "Sustainable clothing, Organic materials...",
      products: 31,
      customers: 89,
      orders: 112,
      user: "Lucas"
    },
    {
      order: "OD-250202-090",
      time: "2 days ago",
      shop: "Petite Sizes",
      content: "Small size clothing, Accessories...",
      products: 47,
      customers: 123,
      orders: 156,
      user: "Ava"
    }
  ]);

  useEffect(() => {
    localStorage.setItem('postView', view);
  }, [view]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="app-container">
      <Topbar />

      <div className="main-content">
        <div className="feed">
          {/* View Toggle Buttons and Search */}
          <div className="view-toggle">
            <div className="search-box">
              <i className="pi pi-search"></i>
              <input type="text" placeholder="Search posts..." />
            </div>
            <div className="view-buttons">
              <Button
                icon="pi pi-th-large"
                className={`p-button-text ${view === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewChange('grid')}
              />
              <Button
                icon="pi pi-list"
                className={`p-button-text ${view === 'feed' ? 'active' : ''}`}
                onClick={() => handleViewChange('feed')}
              />
              <Button
                icon="pi pi-table"
                className={`p-button-text ${view === 'table' ? 'active' : ''}`}
                onClick={() => handleViewChange('table')}
              />
            </div>
          </div>

          {view === 'table' ? (
            <TableView posts={posts} />
          ) : (
            <div className={`posts-container ${view}`}>
              {posts.map((post, index) => (
                <Post
                  key={index}
                  order={post.order}
                  user={post.user}
                  time={post.time}
                  shop={post.shop}
                  content={post.content}
                  products={post.products}
                  customers={post.customers}
                  orders={post.orders}
                  view={view}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
