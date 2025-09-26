import React, { useState, useEffect } from 'react';

function Payments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      if (!response.ok) throw new Error('Errore caricamento');
      const data = await response.json();
      // Handle both array and object with orders property
      const orders = Array.isArray(data) ? data : (data.orders || []);
      // Show only delivered orders (ready for payment)
      setOrders(orders.filter(o => o.status === 'delivered'));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const processPayment = async (orderId, paymentMethod) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: paymentMethod })
      });

      if (!response.ok) throw new Error('Errore nel pagamento');
      
      await fetchOrders();
      alert('Pagamento registrato con successo!');
    } catch (err) {
      alert('Errore: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Gestione Pagamenti</h2>
      
      {orders.length === 0 ? (
        <p>Nessun ordine da pagare</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              border: '2px solid #ddd',
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '2px solid #ddd'
              }}>
                <div>
                  <h3 style={{ margin: 0 }}>Tavolo {order.table_number}</h3>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {new Date(order.created_at).toLocaleString('it-IT')}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#007bff'
                }}>
                  €{parseFloat(order.total_amount).toFixed(2)}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Dettaglio Ordine:</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {order.items && order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '5px 0' }}>
                          {item.quantity}x {item.name}
                        </td>
                        <td style={{ padding: '5px 0', textAlign: 'right' }}>
                          €{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid #ddd' }}>
                      <td style={{ padding: '10px 0', fontWeight: 'bold' }}>
                        TOTALE
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold' }}>
                        €{parseFloat(order.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style={{ 
                display: 'flex',
                gap: '10px',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => processPayment(order.id, 'cash')}
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontSize: '16px'
                  }}
                >
                  💵 Contanti
                </button>
                <button
                  onClick={() => processPayment(order.id, 'card')}
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontSize: '16px'
                  }}
                >
                  💳 Carta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payments;
