import React from 'react';
import { Button } from 'primereact/button';

export default function TableView({ posts }) {
  return (
    <div className="table-container">
      <table className="posts-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Time</th>
            <th>Shop</th>
            <th>Content</th>
            <th>Products</th>
            <th>Customers</th>
            <th>Orders</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{post.order}</td>
              <td>{post.time}</td>
              <td>{post.shop}</td>
              <td>{post.content}</td>
              <td>{post.products}</td>
              <td>{post.customers}</td>
              <td>{post.orders}</td>
              <td>{post.user}</td>
              <td>
                <Button icon="pi pi-pencil" className="p-button-text action-btn compact-btn" tooltip="Edit" size="small" />
                <Button icon="pi pi-trash" className="p-button-text action-btn delete-btn compact-btn" tooltip="Delete" size="small" />
                <Button icon="pi pi-lock" className="p-button-text action-btn locked-btn compact-btn" tooltip="Lock" size="small" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
