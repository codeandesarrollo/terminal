const express = require('express');
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de PayPal
paypal.configure({
  'mode': 'sandbox',  // Cambia a 'live' cuando estés listo para producción
  'client_id': 'AZ3S42JQWCvwNOFupaZDIsNpxezZ7aj9vYv5msfCx51MRvMrf4Ni4lq1f6A18gRjpUVGPzSPjsGT9sjE',
  'client_secret': 'EFuLNpRxK1wUyZgoXoo-sJYTpA_x-C24epgZCCXT1c1EpeJAZiD4ogMIa7GBe-ukayt8z-Lb6BMt8H4D'
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
          first_name: "Cliente",  // Puede ser obtenido del formulario o base de datos
          last_name: "Cliente"    // Lo mismo aquí
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
      console.error(error.response);
      res.status(500).send({ error: error.response });
    } else {
      res.status(200).send(payment);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
