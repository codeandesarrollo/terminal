app.post('/api/pagos', async (req, res) => {
  try {
    const { token, monto, descripcion } = req.body;

    const orden = await conekta.orders.create({
      currency: 'MXN',
      customer_info: {
        name: req.body.nombre_cliente || 'Cliente Generico',
        email: req.body.email || 'no-reply@example.com'
      },
      line_items: [{
        name: descripcion,
        unit_price: monto * 100, // Convertir a centavos
        quantity: 1
      }],
      metadata: { // Datos adicionales
        proyecto: "Agencia de Viajes",
        internal_id: "12345"
      }
    });

    res.status(201).json({
      estado: "éxito",
      orden_id: orden.id,
      monto: orden.amount / 100
    });

  } catch (error) {
    console.error('Error en pago:', error);
    res.status(500).json({
      estado: "error",
      codigo: error.code || 'DESCONOCIDO',
      mensaje: error.message
    });
  }
});