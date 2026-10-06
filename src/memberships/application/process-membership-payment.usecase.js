import { MembershipsRepository } from '../infrastructure/memberships.repository.js';
import { PaymentService } from '../domain/services/payment.service.js';

/**
 * Caso de uso: procesar el pago de una membresía.
 * Enruta el pago según el método (`card` o `wallet`), captura los errores
 * y siempre devuelve una respuesta con forma uniforme (nunca lanza).
 *
 * @param {{ method: 'card'|'wallet', [key: string]: * }} paymentData Datos del pago.
 * @param {number|string} userId Identificador del usuario que paga.
 * @returns {Promise<{ success: boolean, status: string, message: string, subscription?: object, receipt?: object, errors?: Array<string> }>}
 *   Resultado normalizado del pago.
 */
export async function processMembershipPaymentUseCase(paymentData, userId) {
    if (!paymentData || !userId) {
        throw new Error('Datos de pago y usuario requeridos');
    }

    try {
        if (paymentData.method === 'card') {
            return await processCard(paymentData, userId);
        }
        if (paymentData.method === 'wallet') {
            return await processWallet(paymentData, userId);
        }
        return {
            success: false,
            status: 'invalid_method',
            message: 'Método de pago no válido',
            errors: ['Método de pago no válido']
        };
    } catch (error) {
        return {
            success: false,
            status: 'failed',
            message: `Error en pago: ${error.message}`,
            errors: error.details || [error.message]
        };
    }
}

/**
 * Valida los datos de la tarjeta y, si son correctos, ejecuta el cobro.
 * @param {object} paymentData Datos de pago con tarjeta.
 * @param {number|string} userId Identificador del usuario.
 * @returns {Promise<object>} Resultado del cobro o error de validación.
 */
async function processCard(paymentData, userId) {
    const v = PaymentService.validateCardData({
        cardNumber: paymentData.cardNumber,
        month: paymentData.expiryMonth,
        year: paymentData.expiryYear,
        cvv: paymentData.cvv,
        holderName: paymentData.holderName
    });

    if (!v?.isValid) {
        return {
            success: false,
            status: 'invalid_data',
            message: 'Datos de tarjeta inválidos',
            errors: v?.errors || ['Datos de tarjeta inválidos']
        };
    }

    return await chargeAndPersist({
        ...paymentData,
        method: 'card',
        userId
    });
}

/**
 * Valida la billetera digital y, si es válida, ejecuta el cobro.
 * @param {object} paymentData Datos de pago con billetera.
 * @param {number|string} userId Identificador del usuario.
 * @returns {Promise<object>} Resultado del cobro o error de validación.
 */
async function processWallet(paymentData, userId) {
    if (!PaymentService.validateDigitalWallet(paymentData.walletId)) {
        return {
            success: false,
            status: 'invalid_wallet',
            message: 'ID de billetera inválido',
            errors: ['Billetera digital no válida']
        };
    }
    return await chargeAndPersist({
        ...paymentData,
        method: 'wallet',
        userId
    });
}

/**
 * Ejecuta cobro simulado y crea la suscripción.
 * El backend cancela la suscripción activa anterior del usuario.
 *
 * @param {object} data Datos combinados del pago y del plan.
 * @returns {Promise<object>} Respuesta uniforme con la suscripción y el recibo.
 */
async function chargeAndPersist(data) {
    const {
        userId,
        planId,
        planName,
        billingCycle = 'monthly',
        amount = 0,
        currency = 'PEN',
        method
    } = data;

    // 1) Cobro simulado
    const charge = PaymentService.processPayment({ amount, currency, method });
    if (charge?.status !== 'success') {
        return {
            success: false,
            status: 'declined',
            message: 'El cobro fue rechazado',
            errors: ['El cobro fue rechazado']
        };
    }

    // 2) Crea la suscripción
    const payload = {
        userId,
        planId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: calculateEndDate(billingCycle),
        transactionId: charge.transactionId,
        paymentMethod: method,
        amount
    };

    // incluir walletId cuando aplique (para trazabilidad)
    if (method === 'wallet' && data.walletId) payload.walletId = data.walletId;

    // El backend cancela la suscripción activa anterior al hacer POST /subscriptions
    const saved = await MembershipsRepository.createSubscription(payload);

    // 3) Respuesta uniforme
    return {
        success: true,
        status: 'approved',
        message: 'Pago procesado exitosamente',
        subscription: saved,
        receipt: {
            transactionId: charge.transactionId,
            amount,
            currency,
            date: charge.timestamp,
            planName
        }
    };
}

/**
 * Calcula la fecha de fin de la suscripción según el ciclo de facturación.
 * @param {'monthly'|'quarterly'|'annual'} billingCycle Ciclo de facturación.
 * @returns {string} Fecha de fin en formato ISO.
 */
function calculateEndDate(billingCycle) {
    const now = new Date();
    const map = {
        monthly:   () => new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        quarterly: () => new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
        annual:    () => new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    };
    return (map[billingCycle] || map.monthly)().toISOString();
}
