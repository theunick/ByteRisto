// Funzioni API per la gestione degli ordini

const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:3000/api';

// Gestione errori API
const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message || 'Errore di comunicazione con il server');
};

// === ORDINI ===

export const getOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.table_number) params.append('table_number', filters.table_number);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`${ORDER_SERVICE_URL}/orders?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/${orderId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const payOrder = async (orderId, paymentData = {}) => {
  try {
    // Update the order status to 'delivered' (represents paid and completed)
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'delivered' }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return {
      success: true,
      data: data.data,
      payment_info: {
        payment_method: paymentData.payment_method || 'cash',
        payment_amount: paymentData.payment_amount || 0,
        change: paymentData.payment_amount ? Math.max(0, paymentData.payment_amount - parseFloat(data.data.final_amount || 0)) : 0
      }
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getKitchenOrders = async () => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/kitchen`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// === MENU SERVICE ===

const MENU_SERVICE_URL = process.env.REACT_APP_MENU_SERVICE_URL || 'http://localhost:3000/api';

export const getMenu = async () => {
  try {
    const response = await fetch(`${MENU_SERVICE_URL}/menu`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createMenuItem = async (menuItemData) => {
  try {
    const response = await fetch(`${MENU_SERVICE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItemData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// === FUNZIONI DI UTILITÀ ===

export const formatOrderStatus = (status) => {
  const statusLabels = {
    'confirmed': 'Confermato',
    'preparing': 'In Preparazione',
    'ready': 'Pronto',
    'delivered': 'Pagato',
    'payed': 'Pagato',
    'cancelled': 'Annullato'
  };
  
  return statusLabels[status] || status;
};

export const formatOrderType = (type) => {
  const typeLabels = {
    'dine_in': 'Al Tavolo',
    'takeout': 'Da Asporto',
    'delivery': 'Consegna'
  };
  
  return typeLabels[type] || type;
};

export const calculateOrderTiming = (createdAt, estimatedCompletion) => {
  const now = new Date();
  const created = new Date(createdAt);
  const elapsed = Math.floor((now - created) / (1000 * 60)); // minuti trascorsi
  
  let estimatedRemaining = null;
  if (estimatedCompletion) {
    const estimated = new Date(estimatedCompletion);
    estimatedRemaining = Math.floor((estimated - now) / (1000 * 60));
  }
  
  return {
    elapsedMinutes: elapsed,
    estimatedRemainingMinutes: estimatedRemaining,
    isOverdue: estimatedRemaining !== null && estimatedRemaining < 0
  };
};
