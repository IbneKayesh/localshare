import React from "react";
import { Button } from "primereact/button";

export default function Post({
  order,
  user,
  time,
  shop,
  content,
  products = 0,
  customers = 0,
  orders = 0,
  view = "grid",
}) {
  return (
    <div className={`post-card-enhanced ${view}`}>
      {/* First Row: Order left, Shop right */}
      <div className="post-row post-row-first">
        <div><strong>{order}</strong></div>
        <div className="shop">{shop}</div>
      </div>

      {/* Second Row: Time left, User right */}
      <div className="post-row post-row-second">
        <div><small>{time}</small></div>
        <div className="user"><i className="pi pi-user"></i> {user}</div>
      </div>

      {/* Third Row: Content */}
      <div className="post-content-enhanced">
        <p>{content}</p>
      </div>

      {/* Fourth Row: Icons counts left, Action buttons right */}
      <div className="post-row post-row-fourth">
        <div className="post-metrics">
          <div className="metric-item">
            <i className="pi pi-box"></i>
            <span>{products}</span>
          </div>
          <div className="metric-item">
            <i className="pi pi-users"></i>
            <span>{customers}</span>
          </div>
          <div className="metric-item">
            <i className="pi pi-shopping-cart"></i>
            <span>{orders}</span>
          </div>
        </div>
        <div className="post-buttons">
          <Button
            icon="pi pi-pencil"
            className="p-button-text action-btn compact-btn"
            tooltip="Edit Order"
            tooltipOptions={{ position: "top" }}
            size="small"
          />
          <Button
            icon="pi pi-trash"
            className="p-button-text action-btn delete-btn compact-btn"
            tooltip="Delete Order"
            tooltipOptions={{ position: "top" }}
            size="small"
          />
          <Button
            icon="pi pi-lock"
            className="p-button-text action-btn locked-btn compact-btn"
            tooltip="Lock Order"
            tooltipOptions={{ position: "top" }}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}
