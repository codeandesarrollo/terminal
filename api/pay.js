const express = require('express');
const conekta = require('conekta');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configura Conekta (usa tu API key de prueba)
conekta.api_key = 'key_MXBwNaLDdaeNtA8i3IKHvXr'; // Llave pública de sandbox (cámbiala por la tuya)
conekta.api_version = '2.0.0'; // Versión de la API

// Ruta para procesar pagos
app.post('/procesar-pago', async (req, res) => {
  try {
    const { token, amount, description } = req.body;

    // Crea el cargo
    const charge = await conekta.Order.create({
      currency: 'MXN',
      customer_info: {
        name: 'Cliente de prueba',
        email: 'cliente@prueba.com',
        phone: '+5215555555555'
      },
      line_items: [{
        name: description,
        unit_price: amount * 100, // En centavos (ej: $100.00 MXN = 10000)
        quantity: 1
      }],
      charges: [{
        payment_method: {
          type: 'card',
          token_id: token // Token generado en frontend o pruebas
        }
      }]
    });

    res.json({ success: true, charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});