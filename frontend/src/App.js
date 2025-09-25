import React, { useState } from 'react';
import MenuDisplay from './components/MenuDisplay';
import OrderView from './components/OrderView';
import KitchenView from './components/KitchenView';

function App() {
  const [activeView, setActiveView] = useState('menu');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        backgroundColor: '#333', 
        color: 'white', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h1>ByteRisto</h1>
      </header>

      <nav style={{ 
        backgroundColor: '#f4f4f4', 
        padding: '10px',
        marginBottom: '20px'
      }}>
        <button onClick={() => setActiveView('menu')} style={{ 
          margin: '0 5px',
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: activeView === 'menu' ? '#007bff' : '#fff',
          color: activeView === 'menu' ? 'white' : 'black',
          border: '1px solid #ddd'
        }}>
          Menu
        </button>
        <button onClick={() => setActiveView('orders')} style={{ 
          margin: '0 5px',
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: activeView === 'orders' ? '#007bff' : '#fff',
          color: activeView === 'orders' ? 'white' : 'black',
          border: '1px solid #ddd'
        }}>
          Ordini
        </button>
        <button onClick={() => setActiveView('kitchen')} style={{ 
          margin: '0 5px',
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: activeView === 'kitchen' ? '#007bff' : '#fff',
          color: activeView === 'kitchen' ? 'white' : 'black',
          border: '1px solid #ddd'
        }}>
          Cucina
        </button>
      </nav>

      <main style={{ padding: '20px' }}>
        {activeView === 'menu' && <MenuDisplay />}
        {activeView === 'orders' && <OrderView />}
        {activeView === 'kitchen' && <KitchenView />}
      </main>
    </div>
  );
}

export default App;
