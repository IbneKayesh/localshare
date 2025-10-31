import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Menu } from "primereact/menu";

const navItems = [
  { icon: 'pi pi-chart-bar', tooltip: 'Dashboard', command: () => console.log('Dashboard clicked') },
  { icon: 'pi pi-plus', tooltip: 'Create', command: () => console.log('Create clicked') },
  { icon: 'pi pi-pencil', tooltip: 'Draft', command: () => console.log('Draft clicked') },
  { icon: 'pi pi-wifi', tooltip: 'Live', command: () => console.log('Live clicked') },
  { icon: 'pi pi-lock', tooltip: 'Locked', command: () => console.log('Locked clicked') },
  { icon: 'pi pi-check-circle', tooltip: 'Approval', command: () => console.log('Approval clicked') },
  { icon: 'pi pi-hammer', tooltip: 'Ready', command: () => console.log('Ready clicked') },
  { icon: 'pi pi-receipt', tooltip: 'PO', command: () => console.log('PO clicked') },
  { icon: 'pi pi-truck', tooltip: 'Delivery', command: () => console.log('Delivery clicked') },
  { icon: 'pi pi-search', tooltip: 'Search', command: () => console.log('Search clicked') },
  { icon: 'pi pi-users', tooltip: 'Vendors', command: () => console.log('Vendors clicked') }
];

export default function Topbar() {
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = navItems.map(item => ({
    label: item.tooltip,
    icon: item.icon,
    command: () => {
      item.command();
      setIsMenuOpen(false);
    }
  }));

  return (
    <div className="topbar">
      {/* Navigation Buttons */}
      <div className="topbar-center">
        <Tooltip target=".nav-btn" />
        {navItems.map((item, index) => (
          <Button
            key={index}
            icon={item.icon}
            className="p-button-text nav-btn"
            tooltip={item.tooltip}
            tooltipOptions={{ position: "bottom" }}
            onClick={item.command}
          />
        ))}

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

        {/* Mobile Menu */}
        <Menu
          ref={menuRef}
          model={menuItems}
          popup
          className="mobile-menu-panel"
          onShow={() => setIsMenuOpen(true)}
          onHide={() => setIsMenuOpen(false)}
        />
      </div>
    </div>
  );
}
