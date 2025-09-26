import React, { useState, useEffect } from 'react';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'primi'
  });

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/menu');
      if (!response.ok) throw new Error('Errore nel caricamento del menu');
      const data = await response.json();
      // Handle both array and object with items property
      const items = Array.isArray(data) ? data : (data.items || []);
      setMenuItems(items);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    try {
      const response = await fetch('http://localhost:3000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          price: parseFloat(newItem.price),
          category: newItem.category,
          available: true
        })
      });

      if (!response.ok) throw new Error('Errore nell\'aggiunta del piatto');
      
      await fetchMenuItems();
      setNewItem({ name: '', price: '', category: 'primi' });
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Vuoi eliminare questo piatto?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/menu/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Errore nell\'eliminazione');
      await fetchMenuItems();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentStatus })
      });

      if (!response.ok) throw new Error('Errore nell\'aggiornamento');
      await fetchMenuItems();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div style={{ color: 'red' }}>Errore: {error}</div>;

  return (
    <div>
      <h2>Gestione Menu</h2>

      <div style={{ 
        backgroundColor: '#f9f9f9',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h3>Aggiungi Nuovo Piatto</h3>
        <form onSubmit={handleAddItem}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              style={{ 
                padding: '8px',
                width: '300px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Prezzo (€):</label>
            <input
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              style={{ 
                padding: '8px',
                width: '150px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              style={{ 
                padding: '8px',
                width: '200px',
                border: '1px solid #ddd'
              }}
            >
              <option value="antipasti">Antipasti</option>
              <option value="primi">Primi</option>
              <option value="secondi">Secondi</option>
              <option value="contorni">Contorni</option>
              <option value="dolci">Dolci</option>
              <option value="bevande">Bevande</option>
            </select>
          </div>

          <button type="submit" style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}>
            Aggiungi Piatto
          </button>
        </form>
      </div>

      <h3>Menu Corrente</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Nome</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Categoria</th>
            <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Prezzo</th>
            <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Disponibilità</th>
            <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd' }}>
                Nessun piatto nel menu
              </td>
            </tr>
          ) : (
            menuItems.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.category}</td>
                <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                  €{parseFloat(item.price).toFixed(2)}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => toggleAvailability(item.id, item.available)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: item.available ? '#28a745' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {item.available ? 'Disponibile' : 'Non disponibile'}
                  </button>
                </td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MenuManagement;
