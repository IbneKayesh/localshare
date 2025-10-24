import React from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";

export default function Topbar() {
  return (
    <div className="topbar">
      {/* Left: App Title */}
      <div className="topbar-left">
        <div className="logo">OM</div>
      </div>

      {/* Middle: Navigation Buttons */}
      <div className="topbar-center">
        <Tooltip target=".nav-btn" />
        <Button
          icon="pi pi-chart-bar"
          className="p-button-text nav-btn"
          tooltip="Dashboard"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-plus"
          className="p-button-text nav-btn"
          tooltip="Create"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-text nav-btn"
          tooltip="Draft"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-wifi"
          className="p-button-text nav-btn"
          tooltip="Live"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-lock"
          className="p-button-text nav-btn"
          tooltip="Locked"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-check-circle"
          className="p-button-text nav-btn"
          tooltip="Approval"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-hammer"
          className="p-button-text nav-btn"
          tooltip="Ready"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-receipt"
          className="p-button-text nav-btn"
          tooltip="PO"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-truck"
          className="p-button-text nav-btn"
          tooltip="Delivery"
          tooltipOptions={{ position: 'bottom' }}
        />
        <Button
          icon="pi pi-search"
          className="p-button-text nav-btn"
          tooltip="Search"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-users"
          className="p-button-text nav-btn"
          tooltip="Vendors"
          tooltipOptions={{ position: "bottom" }}
        />
      </div>

      {/* Right: User Profile */}
      <div className="topbar-right">
        <Tooltip target=".right-btn" />

        <Button
          icon="pi pi-bell"
          className="p-button-text right-btn"
          tooltip="Notifications"
          tooltipOptions={{ position: "bottom" }}
        />
        <Button
          icon="pi pi-cog"
          className="p-button-text right-btn"
          tooltip="Settings"
          tooltipOptions={{ position: "bottom" }}
        />

        <Avatar
          image="https://i.pravatar.cc/40?img=12"
          shape="circle"
          tooltip="John Doe"
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </div>
  );
}
