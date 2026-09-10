import assert from 'assert';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Verificación no intrusiva - iniciando');

try {

    const { ContentModerationService } = await import('../src/reviews/domain/services/content-moderation.service.js');
    console.log('\n[Moderación automática] Probando validaciones...');
    const good = ContentModerationService.validateContent('Excelente comida, muy recomendado!');
    console.log(' - Contenido válido -> isApropriate =', good.isApropriate);
    const bad = ContentModerationService.validateContent('Este lugar es una ofensa');
    console.log(' - Contenido ofensivo -> isApropriate =', bad.isApropriate, 'reason=', bad.reason);
    const hasUrl = ContentModerationService.validateContent('Visita http://malito.com');
    console.log(' - Contiene URL -> isApropriate =', hasUrl.isApropriate);


    const { PasswordRecoveryService } = await import('../src/auth/domain/services/password-recovery.service.js');
    console.log('\n[Recuperación de contraseña] Probando generación y validación de token...');
    const email = 'test@example.com';
    const token = PasswordRecoveryService.generateRecoveryToken(email);
    console.log(' - Token generado:', token ? 'OK' : 'ERROR');
    const tokenData = PasswordRecoveryService.validateRecoveryToken(token);
    console.log(' - Token validado ->', tokenData ? 'OK' : 'INVALID');


    const { PaymentService } = await import('../src/memberships/domain/services/payment.service.js');
    console.log('\n[Pago de suscripción] Probando validaciones de tarjeta y datos...');

    const validCard = PaymentService.validateCardNumber('4111111111111111');
    console.log(' - Número tarjeta válido ->', validCard);
    const invalidCard = PaymentService.validateCardNumber('1234567890123456');
    console.log(' - Número tarjeta inválido ->', invalidCard);
    const cardValidation = PaymentService.validateCardData({
        cardNumber: '4111111111111111',
        month: '12',
        year: String(new Date().getFullYear() + 1),
        cvv: '123',
        holderName: 'Juan Perez'
    });
    console.log(' - Validación datos tarjeta -> isValid =', cardValidation.isValid, 'errors =', cardValidation.errors);


    const { PromotionEntity } = await import('../src/promotions/domain/model/promotion.entity.js');
    console.log('\n[Promociones destacadas] Probando entidad...');
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const promo = new PromotionEntity({
        id: 1,
        title: 'Promo Test',
        startDate: now.toISOString(),
        endDate: future.toISOString(),
        maxUses: 10,
        currentUses: 0,
        discount: 20,
        featured: true
    });
    console.log(' - isActive() ->', promo.isActive());
    promo.currentUses = 10;
    console.log(' - isFull() after setting currentUses=10 ->', promo.isFull());

    const results = {
        moderation: {
            good: good.isApropriate === true,
            bad: bad.isApropriate === false,
            url: hasUrl.isApropriate === false
        },
        passwordRecovery: {
            tokenGenerated: typeof token === 'string' && token.length > 0,
            tokenValid: tokenData && tokenData.email === email
        },
        payment: {
            validCard: validCard === true,
            invalidCard: invalidCard === false,
            cardValidation: cardValidation.isValid === true
        },
        promotions: {
            active: promo.isActive() === true,
            full: promo.isFull() === true
        }
    };

    console.log('\nResumen de verificación:');
    console.log(JSON.stringify(results, null, 2));

    const allOk = Object.values(results).every(group => Object.values(group).every(Boolean));
    if (allOk) {
        console.log('\n> Resultado: Todos los checks rápidos pasaron.');
        process.exit(0);
    } else {
        console.log('\n> Resultado: Algunos checks fallaron. Revisa el output arriba.');
        process.exit(2);
    }

} catch (err) {
    console.error('Error al ejecutar verificaciones:', err);
    process.exit(3);
}
