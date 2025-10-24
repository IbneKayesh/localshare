import React, { useRef } from "react";

import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import { OverlayPanel } from 'primereact/overlaypanel';

function CSFile() {
  const overlayPanelRef = useRef(null);

  const buttons = (
    <div>
      <ButtonGroup>
        <Button label="Statistics" icon="pi pi-chart-scatter" size="small" />
        <Button label="Delete" icon="pi pi-trash" size="small" />
        <Button label="Sample Upload" icon="pi pi-paperclip" size="small"/>
        <Button label="Send Document" icon="pi pi-upload" size="small"/>
        <Button label="Negotiate" icon="pi pi-send" size="small"/>
        <Button label="On Behalf" icon="pi pi-cart-plus" size="small"/>
        <Button label="Select" icon="pi pi-check" size="small"/>
        <Button label="Selection Note" icon="pi pi-clipboard" size="small"/>
        <Button label="Revise Rate" icon="pi pi-dollar" size="small" />
      </ButtonGroup>
    </div>
  );

  const showOverlay = (event, itemData) => {
    overlayPanelRef.current.toggle(event);
  };

  const itemData = {
    name: 'Macbook Air M4 16/256',
    quantity: 150,
    rate: 110500,
    description: 'High-performance laptop with M4 chip, 16GB RAM, 256GB SSD.',
    specifications: 'Processor: Apple M4, RAM: 16GB, Storage: 256GB SSD, Display: 13.6-inch Liquid Retina',
    warranty: '1 year manufacturer warranty',
    supplier: 'Apple Studio'
  };

  return (
    <div>
      <OverlayPanel ref={overlayPanelRef}>
        <div style={{ padding: '10px', maxWidth: '300px' }}>
          <h4>{itemData.name}</h4>
          <p><strong>Quantity:</strong> {itemData.quantity} Pcs</p>
          <p><strong>Rate:</strong> {itemData.rate}/-</p>
          <p><strong>Description:</strong> {itemData.description}</p>
          <p><strong>Specifications:</strong> {itemData.specifications}</p>
          <p><strong>Warranty:</strong> {itemData.warranty}</p>
          <p><strong>Supplier:</strong> {itemData.supplier}</p>
        </div>
      </OverlayPanel>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th rowSpan={2}>Item</th>
            <th rowSpan={2}>Supplier</th>
            <th colSpan={2}>Negotiation 1</th>
            <th colSpan={2}>Negotiation 2</th>
            <th rowSpan={2}>Final Rate</th>
            <th rowSpan={2}>Actions</th>
          </tr>
          <tr>
            <th>Purchaser</th>
            <th>Supplier</th>
            <th>Purchaser</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td onClick={(e) => showOverlay(e, itemData)} style={{ cursor: 'pointer' }}>
              1000 - Macbook Air M4 16/256
              <br />
              150 Pcs / 110500/-
            </td>
            <td>
              Apple Studio
              <br />
              Gulshan 2, Dhaka
            </td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>{buttons}</td>
          </tr>
          <tr>
            <td onClick={(e) => showOverlay(e, itemData)} style={{ cursor: 'pointer' }}>
              1000 - Macbook Air M4 16/256
              <br />
              150 Pcs / 110500/-
            </td>
            <td>
              Executive Machine
              <br />
              Gulshan 2, Dhaka
            </td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>{buttons}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CSFile;
