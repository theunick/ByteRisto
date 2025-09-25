import React from 'react';

function OrderView() {
  // Static mock data - no functionality
  const mockOrders = [
    { id: 1, table: 5, items: ['Pizza Margherita', 'Carbonara'], status: 'pending' },
    { id: 2, table: 3, items: ['Lasagna'], status: 'preparing' }
  ];

  return (
    <div>
      <h2>Ordini</h2>
      <p style={{ color: '#666' }}>Visualizzazione ordini (mock data)</p>
      
      <div style={{ marginTop: '20px' }}>
        {mockOrders.map(order => (
          <div key={order.id} style={{ 
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9'
          }}>
            <div><strong>Tavolo {order.table}</strong></div>
            <div style={{ marginTop: '10px' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {order.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '10px', color: '#666' }}>
              Status: {order.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderView;
