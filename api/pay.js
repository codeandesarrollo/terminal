const axios = require('axios');

// Tus credenciales de PayPal
const clientId = 'AW79wRK5RvhvX2aDDoOgXeadTdkEl1soGvAKdga9uUdsNG4umGrf9pf38zEQ2_WVsD2mT_2G-BvwHPn4';
const secret = 'ELtlNn5XddAEt9NwsYi4BvAg8CXacZcpf_TjKLxsXqZ64woQUHVDvep66KgY2_1kxI-hUnH0SutgwLN8';

// Función para obtener el token de acceso
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
        console.error('Error al obtener el token de acceso:', error);
        throw error;
    }
}

// Función para capturar el pago
async function capturePayment(orderId) {
    const accessToken = await getAccessToken();
    try {
        const response = await axios.post(`https://api.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Pago capturado con éxito:', response.data);
    } catch (error) {
        console.error('Error al capturar el pago:', error);
    }
}
