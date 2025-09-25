import React from 'react';

function MenuDisplay() {
  // Static hardcoded menu - no backend
  const menuItems = [
    { id: 1, name: 'Pizza Margherita', price: 8.50 },
    { id: 2, name: 'Lasagna', price: 12.00 },
    { id: 3, name: 'Carbonara', price: 10.00 },
    { id: 4, name: 'Risotto ai Funghi', price: 11.00 },
    { id: 5, name: 'Tiramisù', price: 5.50 }
  ];

  return (
    <div>
      <h2>Menu</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Piatto</th>
            <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Prezzo</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
              <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                €{item.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuDisplay;
