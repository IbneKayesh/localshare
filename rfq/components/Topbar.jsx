import React, { useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";
import { OverlayPanel } from "primereact/overlaypanel";

export default function Topbar() {
  const menuRef = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="topbar">
      {/* Left: App Title */}
      <div className="topbar-left">
        <div className="logo">Quotation</div>
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

        {/* Mobile Menu Button */}
        <Button
          icon="pi pi-bars"
          className="p-button-text nav-btn mobile-menu-btn"
          onClick={(e) => {
            menuRef.current.toggle(e);
            setIsMenuOpen(!isMenuOpen);
          }}
          tooltip="More"
          tooltipOptions={{ position: "bottom" }}
        />

        {/* Mobile Floating Menu */}
        <OverlayPanel ref={menuRef} className="mobile-menu-panel" onShow={() => setIsMenuOpen(true)} onHide={() => setIsMenuOpen(false)}>
          <div className="mobile-menu-content">
            <Button
              icon="pi pi-chart-bar"
              label="Dashboard"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-plus"
              label="Create"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-pencil"
              label="Draft"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-wifi"
              label="Live"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-lock"
              label="Locked"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-check-circle"
              label="Approval"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-hammer"
              label="Ready"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-receipt"
              label="PO"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-truck"
              label="Delivery"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-search"
              label="Search"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
            <Button
              icon="pi pi-users"
              label="Vendors"
              className="p-button-text mobile-menu-item"
              onClick={() => menuRef.current.hide()}
            />
          </div>
        </OverlayPanel>
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
