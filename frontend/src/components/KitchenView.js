import React, { useState, useEffect } from 'react';

function KitchenView() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    // Refresh every 2 seconds for real-time updates
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      if (!response.ok) throw new Error('Errore caricamento');
      const data = await response.json();
      // Show only orders that need kitchen attention
      setOrders(data.filter(o => ['pending', 'preparing'].includes(o.status)));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Errore aggiornamento');
      await fetchOrders();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    return status === 'pending' ? '#ffc107' : '#17a2b8';
  };

  const getStatusLabel = (status) => {
    return status === 'pending' ? 'In Attesa' : 'In Preparazione';
  };

  return (
    <div>
      <h2>Cucina</h2>
      <p style={{ color: '#666' }}>Ordini da preparare</p>
      
      {orders.length === 0 ? (
        <p>Nessun ordine da preparare</p>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              border: '2px solid #ddd',
              padding: '15px',
              backgroundColor: 'white'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
              }}>
                <h3 style={{ margin: 0 }}>Tavolo {order.table_number}</h3>
                <div style={{ 
                  padding: '5px 10px',
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                {new Date(order.created_at).toLocaleTimeString('it-IT')}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
                {order.items && order.items.map((item, idx) => (
                  <li key={idx} style={{ padding: '5px 0' }}>
                    <strong>{item.quantity}x</strong> {item.name}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '15px', display: 'flex', gap: '5px' }}>
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(order.id, 'preparing')}
                    style={{ 
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Inizia
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateStatus(order.id, 'ready')}
                    style={{ 
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Pronto
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default KitchenView;
