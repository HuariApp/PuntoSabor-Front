export class PaymentService {
    /**
     * Valida número de tarjeta (Luhn algorithm)
     * @param {string} cardNumber
     * @returns {boolean}
     */
    static validateCardNumber(cardNumber) {
        const digits = String(cardNumber).replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return false;
        let sum = 0;
        let doubleDigit = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let d = parseInt(digits.charAt(i), 10);
            if (Number.isNaN(d)) return false;

            if (doubleDigit) {
                d = d * 2;
                if (d > 9) d -= 9;
            }

            sum += d;
            doubleDigit = !doubleDigit;
        }

        return sum % 10 === 0;
    }

    /**
     * Valida fecha de vencimiento
     * @param {string} month - MM
     * @param {string} year - YYYY
     * @returns {boolean}
     */
    static validateExpiry(month, year) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        const expiryYear = parseInt(year, 10);
        const expiryMonth = parseInt(month, 10);

        if (expiryYear < currentYear) {
            return false;
        }

        if (expiryYear === currentYear && expiryMonth < currentMonth) {
            return false;
        }

        return true;
    }

    /**
     *
     * @param {string} cvv
     * @returns {boolean}
     */
    static validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    /**
     *
     * @param {string} walletId
     * @returns {boolean}
     */
    static validateDigitalWallet(walletId) {
        return walletId && walletId.length >= 8;
    }

    /**
     *
     * @param {Object} cardData
     * @returns {Object} { isValid: boolean, errors: string[] }
     */
    static validateCardData(cardData) {
        const errors = [];

        if (!cardData.cardNumber || !this.validateCardNumber(cardData.cardNumber)) {
            errors.push('Número de tarjeta inválido');
        }

        if (!cardData.month || !cardData.year || !this.validateExpiry(cardData.month, cardData.year)) {
            errors.push('Fecha de vencimiento inválida o expirada');
        }

        if (!cardData.cvv || !this.validateCVV(cardData.cvv)) {
            errors.push('CVV inválido');
        }

        if (!cardData.holderName || cardData.holderName.trim().length < 3) {
            errors.push('Nombre del titular inválido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Simula procesamiento de pago
     * @param {Object} paymentData
     * @returns {Object} Resultado del pago
     */
    static processPayment(paymentData) {
        // Generar ID de transacción
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return {
            transactionId,
            status: 'success',
            amount: paymentData.amount,
            currency: paymentData.currency || 'PEN',
            timestamp: new Date().toISOString(),
            method: paymentData.method
        };
    }
}
