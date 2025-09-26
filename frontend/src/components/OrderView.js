import React, { useState, useEffect } from 'react';

function OrderView() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState({
    table_number: '',
    items: []
  });
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    // Refresh orders every 3 seconds
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      if (!response.ok) throw new Error('Errore nel caricamento ordini');
      const data = await response.json();
      // Handle both array and object with orders property
      const orders = Array.isArray(data) ? data : (data.orders || []);
      setOrders(orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu');
      if (!response.ok) throw new Error('Errore nel caricamento menu');
      const data = await response.json();
      // Handle both array and object with items property
      const items = Array.isArray(data) ? data : (data.items || []);
      setMenuItems(items.filter(item => item.available));
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const addItemToOrder = () => {
    if (!selectedItem) return;
    const item = menuItems.find(m => m.id === parseInt(selectedItem));
    if (!item) return;

    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, {
        menu_item_id: item.id,
        name: item.name,
        quantity: quantity,
        price: item.price
      }]
    });
    setSelectedItem('');
    setQuantity(1);
  };

  const removeItemFromOrder = (index) => {
    const items = [...newOrder.items];
    items.splice(index, 1);
    setNewOrder({ ...newOrder, items });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const submitOrder = async () => {
    if (!newOrder.table_number || newOrder.items.length === 0) {
      alert('Inserisci numero tavolo e almeno un piatto');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: parseInt(newOrder.table_number),
          items: newOrder.items.map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) throw new Error('Errore nella creazione ordine');
      
      setNewOrder({ table_number: '', items: [] });
      await fetchOrders();
      alert('Ordine creato con successo!');
    } catch (err) {
      alert('Errore: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Errore aggiornamento stato');
      await fetchOrders();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'preparing': '#17a2b8',
      'ready': '#28a745',
      'delivered': '#6c757d',
      'paid': '#007bff'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div>
      <h2>Gestione Ordini</h2>

      {/* New Order Form */}
      <div style={{ 
        backgroundColor: '#f9f9f9',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h3>Nuovo Ordine</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Numero Tavolo:</label>
          <input
            type="number"
            value={newOrder.table_number}
            onChange={(e) => setNewOrder({...newOrder, table_number: e.target.value})}
            style={{ padding: '8px', width: '150px', border: '1px solid #ddd' }}
            placeholder="Es. 5"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Seleziona Piatto:</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            style={{ padding: '8px', width: '300px', border: '1px solid #ddd' }}
          >
            <option value="">-- Seleziona --</option>
            {menuItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} - €{parseFloat(item.price).toFixed(2)}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{ 
              padding: '8px',
              width: '60px',
              marginLeft: '10px',
              border: '1px solid #ddd'
            }}
          />
          
          <button 
            onClick={addItemToOrder}
            style={{ 
              marginLeft: '10px',
              padding: '8px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Aggiungi
          </button>
        </div>

        {newOrder.items.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Articoli:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {newOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '5px', border: '1px solid #ddd' }}>
                      {item.quantity}x {item.name}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'right', border: '1px solid #ddd' }}>
                      €{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td style={{ padding: '5px', textAlign: 'center', border: '1px solid #ddd', width: '80px' }}>
                      <button
                        onClick={() => removeItemFromOrder(index)}
                        style={{ 
                          padding: '3px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Rimuovi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '10px' }}>
              <strong>Totale: €{calculateTotal(newOrder.items)}</strong>
            </p>
            
            <button
              onClick={submitOrder}
              disabled={loading}
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Invio...' : 'Invia Ordine'}
            </button>
          </div>
        )}
      </div>

      {/* Active Orders */}
      <h3>Ordini Attivi</h3>
      {orders.length === 0 ? (
        <p>Nessun ordine</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {orders.filter(o => o.status !== 'paid').map(order => (
            <div key={order.id} style={{ 
              border: '1px solid #ddd',
              padding: '15px',
              backgroundColor: 'white'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Tavolo {order.table_number}</strong>
                <span style={{ 
                  marginLeft: '15px',
                  padding: '3px 8px',
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                  {order.status}
                </span>
              </div>
              
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                {new Date(order.created_at).toLocaleString('it-IT')}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
                {order.items && order.items.map((item, idx) => (
                  <li key={idx}>• {item.quantity}x {item.name}</li>
                ))}
              </ul>
              
              <div style={{ marginTop: '10px' }}>
                <strong>Totale: €{parseFloat(order.total_amount).toFixed(2)}</strong>
              </div>

              <div style={{ marginTop: '15px' }}>
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    style={{ 
                      padding: '5px 10px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    In Preparazione
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    style={{ 
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Pronto
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    style={{ 
                      padding: '5px 10px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Consegnato
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

export default OrderView;
