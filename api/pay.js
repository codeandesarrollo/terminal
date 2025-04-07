import conekta from 'conekta'; // Usa import (recomendado para Vercel)
// ó const conekta = require('conekta');

// Configuración ESSENCIAL (usa variables de entorno)
conekta.api_key = process.env.CONEKTA_API_KEY || 'key_MXBwNaLDdaeNtA8i3IKHvXr';
conekta.api_version = '2.0.0'; // ¡Versión obligatoria!

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, amount, description } = req.body;

    // ¡Corrige la sintaxis para crear la orden!
    const order = await new Promise((resolve, reject) => {
      conekta.Order.create({
        currency: 'MXN',
        customer_info: {
          name: 'Cliente Prueba',
          email: 'cliente@prueba.com'
        },
        line_items: [{
          name: description,
          unit_price: amount * 100, // En centavos
          quantity: 1
        }],
        charges: [{
          payment_method: {
            type: 'card',
            token_id: token
          }
        }]
      }, (err, order) => err ? reject(err) : resolve(order));
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.details || null
    });
  }
};