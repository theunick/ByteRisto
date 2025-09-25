import React from 'react';

function KitchenView() {
  // Static mock data - no functionality
  const mockOrders = [
    { id: 1, table: 5, items: ['2x Pizza Margherita', '1x Carbonara'], status: 'In preparazione' },
    { id: 2, table: 3, items: ['1x Lasagna'], status: 'In attesa' }
  ];

  return (
    <div>
      <h2>Cucina</h2>
      <p style={{ color: '#666' }}>Visualizzazione ordini cucina (mock data)</p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px',
        marginTop: '20px'
      }}>
        {mockOrders.map(order => (
          <div key={order.id} style={{ 
            border: '2px solid #ddd',
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Tavolo {order.table}</h3>
            <div style={{ 
              padding: '5px 10px',
              backgroundColor: '#ffc107',
              display: 'inline-block',
              marginBottom: '10px',
              fontSize: '12px'
            }}>
              {order.status}
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {order.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KitchenView;
