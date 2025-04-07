document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const paymentData = {
        cardNumber: document.getElementById('cardNumber').value,
        cardType: document.getElementById('cardType').value,
        expMonth: document.getElementById('expMonth').value,
        expYear: document.getElementById('expYear').value,
        cvv: document.getElementById('cvv').value,
        amount: document.getElementById('amount').value,
        firstName: "Cliente", // Puedes agregar campos para nombre/apellido
        lastName: "Apellido"  // en tu formulario si lo necesitas
    };

    // Validación básica del frontend
    if (!validateCard(paymentData)) {
        alert('Por favor complete todos los campos correctamente');
        return;
    }

    // Deshabilitar botón durante el procesamiento
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    try {
        // Enviar datos al servidor
        const response = await fetch('https://terminal-peach-six.vercel.app/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Pago exitoso! ID de transacción: ${result.id}`);
            // Aquí puedes redirigir a una página de éxito o resetear el formulario
            document.getElementById('payment-form').reset();
        } else {
            throw new Error(result.error || 'Error al procesar el pago');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Procesar Pago';
    }
});

// Función de validación básica
function validateCard(data) {
    // Validar número de tarjeta (solo longitud básica)
    if (!data.cardNumber || data.cardNumber.length < 13 || data.cardNumber.length > 19) {
        return false;
    }
    
    // Validar CVV
    if (!data.cvv || (data.cardType === 'amex' ? data.cvv.length !== 4 : data.cvv.length !== 3)) {
        return false;
    }
    
    // Validar fecha de expiración
    const currentYear = new Date().getFullYear();
    if (!data.expMonth || data.expMonth < 1 || data.expMonth > 12) {
        return false;
    }
    if (!data.expYear || data.expYear < currentYear) {
        return false;
    }
    
    // Validar monto
    if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
        return false;
    }
    
    return true;
}