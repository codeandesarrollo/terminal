document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardNumber = document.getElementById('cardNumber').value;
    const cardType = document.getElementById('cardType').value;
    const expMonth = document.getElementById('expMonth').value;
    const expYear = document.getElementById('expYear').value;
    const cvv = document.getElementById('cvv').value;
    const amount = document.getElementById('amount').value;

    fetch('https://terminal-peach-six.vercel.app/pay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cardNumber,
            cardType,
            expMonth,
            expYear,
            cvv,
            amount
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Pago realizado exitosamente");
        console.log(data);
    })
    .catch(error => {
        alert("Hubo un error en el pago");
        console.error(error);
    });
});
