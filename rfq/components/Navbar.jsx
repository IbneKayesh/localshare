import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";
import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel";

export default function Navbar() {
  const [notificationCount] = useState(5); // Demo count, can be dynamic
  const avatarMenuRef = useRef(null);
  const notificationsPanelRef = useRef(null);

  const avatarMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => console.log('Profile clicked')
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => console.log('Logout clicked')
    }
  ];

  const notifications = [
    { id: 1, message: 'New quotation request from ABC Corp', time: '2 min ago' },
    { id: 2, message: 'Approval pending for Q-1234', time: '15 min ago' },
    { id: 3, message: 'Vendor XYZ updated their profile', time: '1 hour ago' },
    { id: 4, message: 'System maintenance scheduled', time: '2 hours ago' },
    { id: 5, message: 'New message from support', time: '1 day ago' }
  ];

  return (
    <div className="navbar">
      {/* Left: App Title */}
      <div className="navbar-left">
        <div className="logo">Quotation 2.0</div>
      </div>

      {/* Right: User Profile */}
      <div className="navbar-right">
        <Tooltip target=".right-btn" />

        <Button
          icon="pi pi-bell"
          className="p-button-text right-btn"
          tooltip="Notifications"
          tooltipOptions={{ position: "bottom" }}
          badge={notificationCount.toString()}
          badgeClassName="p-badge-primary"
          onClick={(e) => notificationsPanelRef.current.toggle(e)}
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
          onClick={(e) => avatarMenuRef.current.toggle(e)}
          className="avatar-clickable"
        />

        {/* Avatar Menu */}
        <Menu
          ref={avatarMenuRef}
          model={avatarMenuItems}
          popup
          className="avatar-menu"
        />

        {/* Notifications Panel */}
        <OverlayPanel
          ref={notificationsPanelRef}
          className="notifications-panel"
          style={{ width: '350px' }}
        >
          <div className="notifications-header">
            <h4>Latest Notifications</h4>
          </div>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
            ))}
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
}
