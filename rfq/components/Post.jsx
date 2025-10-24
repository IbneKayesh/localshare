import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Post({ order, user, time, shop, content, products = 0, customers = 0, orders = 0, view = 'grid' }) {
  return (
    <Card className={`post-card ${view}`}>
      {/* Header */}
      <div className="post-header">
        <div className="post-info-left">
          <strong>{order}</strong>
          <small>{time}</small>
        </div>
        <div className="post-info-right">
          <div style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>
            {shop}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="post-content">
        <p style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
          lineHeight: '1.4'
        }}>
          {content}
        </p>
      </div>

      {/* Action Icons */}
      <div className="post-actions">
        <div className="action-metrics">
          <div className="metric-item">
            <i className="pi pi-box" style={{ color: '#1976d2' }}></i>
            <span>{products}</span>
          </div>
          <div className="metric-item">
            <i className="pi pi-users" style={{ color: '#1976d2' }}></i>
            <span>{customers}</span>
          </div>
          <div className="metric-item">
            <i className="pi pi-shopping-cart" style={{ color: '#d32f2f' }}></i>
            <span>{orders}</span>
          </div>
        </div>
        <div className="action-buttons">
          <div className="user-name-badge">
            <i className="pi pi-user"></i> {user}
          </div>
          <Button
            icon="pi pi-pencil"
            className="p-button-text action-btn compact-btn"
            tooltip="Edit Order"
            tooltipOptions={{ position: 'top' }}
            size="small"
          />
          <Button
            icon="pi pi-trash"
            className="p-button-text action-btn delete-btn compact-btn"
            tooltip="Delete Order"
            tooltipOptions={{ position: 'top' }}
            size="small"
          />
          <Button
            icon="pi pi-lock"
            className="p-button-text action-btn locked-btn compact-btn"
            tooltip="Lock Order"
            tooltipOptions={{ position: 'top' }}
            size="small"
          />
        </div>
      </div>
      {/* User Name moved to actions */}
    </Card>
  );
}
