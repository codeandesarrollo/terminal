// api/pay.js
import Conekta from 'conekta';

// Configura la clave secreta de Conekta desde las variables de entorno
Conekta.api_key = process.env.CONEKTA_SECRET_KEY;  // Aquí accedes a la clave secreta
Conekta.locale = 'es'; // Establece el idioma en español (opcional)

// Manejo de la solicitud POST
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { monto, moneda, destinatario, metodo_pago, detalles_tarjeta } = req.body;

    try {
      // Crear una orden en Conekta
      const order = await Conekta.Order.create({
        line_items: [
          {
            name: 'Producto de prueba', // Nombre del producto o servicio
            unit_price: monto * 100, // Conekta espera el monto en centavos, por lo que multiplicamos por 100
            quantity: 1,
          },
        ],
        currency: moneda,
        customer_info: {
          name: destinatario,
        },
      });

      // Responder con la orden creada
      res.status(200).json({
        message: 'Pago realizado con éxito',
        orderId: order.id,
        status: 'success',
      });
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
