const axios = require('axios');

// Tus credenciales de PayPal en vivo
const clientId = 'AW79wRK5RvhvX2aDDoOgXeadTdkEl1soGvAKdga9uUdsNG4umGrf9pf38zEQ2_WVsD2mT_2G-BvwHPn4';
const secret = 'ELtlNn5XddAEt9NwsYi4BvAg8CXacZcpf_TjKLxsXqZ64woQUHVDvep66KgY2_1kxI-hUnH0SutgwLN8';

// Función para obtener el Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  try {
    const response = await axios.post('https://api.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el Access Token:', error.response.data);
    throw error;
  }
}

// Función para crear la orden
async function createOrder(accessToken) {
  try {
    const response = await axios.post('https://api.paypal.com/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',  // Cambia a tu moneda si es necesario
            value: '10.00'          // Monto del pago
          },
          description: 'Pago de prueba con PayPal'
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.id;  // Retorna el ID de la orden
  } catch (error) {
    console.error('Error al crear la orden:', error.response.data);
    throw error;
  }
}

// Función para capturar el pago
async function capturePayment(accessToken, orderId) {
  try {
    const response = await axios.post(`https://api.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;  // Devuelve los detalles del pago capturado
  } catch (error) {
    console.error('Error al capturar el pago:', error.response.data);
    throw error;
  }
}

// Función principal para procesar el pago
async function processPayment() {
  try {
    // Obtener el token de acceso
    const accessToken = await getAccessToken();
    
    // Crear la orden
    const orderId = await createOrder(accessToken);
    console.log('Orden creada con ID:', orderId);

    // Capturar el pago
    const payment = await capturePayment(accessToken, orderId);
    console.log('Pago procesado con éxito:', payment);
  } catch (error) {
    console.error('Error en el proceso de pago:', error);
  }
}

// Llamar a la función principal para procesar el pago
processPayment();
