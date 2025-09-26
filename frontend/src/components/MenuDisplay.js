import React, { useState, useEffect } from 'react';

function MenuDisplay() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu();
    // Refresh menu every 5 seconds for real-time updates
    const interval = setInterval(fetchMenu, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu');
      if (!response.ok) throw new Error('Errore nel caricamento');
      const data = await response.json();
      // Handle both array and object with items property
      const items = Array.isArray(data) ? data : (data.items || []);
      setMenuItems(items.filter(item => item.available));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const cat = item.category || 'altri';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  };

  if (loading) return <div>Caricamento menu...</div>;
  if (error) return <div style={{ color: 'red' }}>Errore: {error}</div>;

  const groupedItems = groupByCategory(menuItems);

  return (
    <div>
      <h2>Menu</h2>
      {Object.keys(groupedItems).length === 0 ? (
        <p>Nessun piatto disponibile</p>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              textTransform: 'capitalize',
              borderBottom: '2px solid #333',
              paddingBottom: '5px'
            }}>
              {category}
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                      €{parseFloat(item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default MenuDisplay;
