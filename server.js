const express = require('express');
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de PayPal (sin variables de entorno)
paypal.configure({
  'mode': 'sandbox',  // Cambia a 'live' cuando estés listo para producción
  'client_id': 'AZ3S42JQWCvwNOFupaZDIsNpxezZ7aj9vYv5msfCx51MRvMrf4Ni4lq1f6A18gRjpUVGPzSPjsGT9sjE', // Tu client_id
  'client_secret': 'EFuLNpRxK1wUyZgoXoo-sJYTpA_x-C24epgZCCXT1c1EpeJAZiD4ogMIa7GBe-ukayt8z-Lb6BMt8H4D' // Tu client_secret
});

// Ruta para procesar el pago
app.post('/pay', (req, res) => {
  const { cardNumber, cardType, expMonth, expYear, cvv, amount } = req.body;

  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "credit_card",
      funding_instruments: [{
        credit_card: {
          number: cardNumber,
          type: cardType,
          expire_month: expMonth,
          expire_year: expYear,
          cvv2: cvv,
          first_name: "Cliente",  // Nombre del cliente
          last_name: "Cliente"    // Apellido del cliente
        }
      }]
    },
    transactions: [{
      amount: {
        total: amount,
        currency: "USD"
      },
      description: "Pago por servicio"
    }]
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error('Error:', error.response);
      return res.status(500).send({ error: 'Error al procesar el pago' });
    }
    res.status(200).send(payment);
  });
});

// Servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
