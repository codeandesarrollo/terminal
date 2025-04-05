const paypal = require('./server');

// Función para hacer un pago manual
function createPayment(paymentDetails, callback) {
  const paymentData = {
    "intent": "sale",  // Define la intención del pago (puede ser 'sale', 'authorize', 'order')
    "payer": {
      "payment_method": "credit_card",  // El método de pago será tarjeta de crédito
      "funding_instruments": [{
        "credit_card": {
          "number": paymentDetails.cardNumber,  // Número de tarjeta
          "type": paymentDetails.cardType,      // Tipo de tarjeta (Visa, MasterCard, etc.)
          "expire_month": paymentDetails.expMonth,  // Mes de expiración
          "expire_year": paymentDetails.expYear,    // Año de expiración
          "cvv2": paymentDetails.cvv,            // CVV de la tarjeta
          "first_name": paymentDetails.firstName,   // Nombre del titular de la tarjeta
          "last_name": paymentDetails.lastName    // Apellido del titular
        }
      }]
    },
    "transactions": [{
      "amount": {
        "total": paymentDetails.totalAmount,  // Monto total a cobrar
        "currency": paymentDetails.currency  // Moneda (USD, EUR, etc.)
      },
      "description": paymentDetails.description  // Descripción de la transacción
    }]
  };

  // Crear el pago con la API de PayPal
  paypal.payment.create(paymentData, function (error, payment) {
    if (error) {
      console.log("Error al crear el pago:", error.response);
      callback(error, null);
    } else {
      console.log("Pago realizado exitosamente:", payment);
      callback(null, payment);
    }
  });
}

// Exporta la función para usarla en otros archivos
module.exports = createPayment;
