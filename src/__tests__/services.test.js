

import { ContentModerationService } from '@/reviews/domain/services/content-moderation.service.js';

describe('ContentModerationService', () => {

    describe('validateContent', () => {

        test('debe aprobar contenido válido', () => {
            const content = 'Excelente comida, muy recomendado!';
            const result = ContentModerationService.validateContent(content);
            expect(result.isApropriate).toBe(true);
        });

        test('debe rechazar contenido con palabras prohibidas', () => {
            const content = 'Este lugar es una ofensa';
            const result = ContentModerationService.validateContent(content);
            expect(result.isApropriate).toBe(false);
            expect(result.reason).toContain('ofensivo');
        });

        test('debe rechazar contenido con URLs', () => {
            const content = 'Visita http://malito.com para más info';
            const result = ContentModerationService.validateContent(content);
            expect(result.isApropriate).toBe(false);
        });

        test('debe rechazar contenido vacío', () => {
            const result = ContentModerationService.validateContent('');
            expect(result.isApropriate).toBe(false);
        });

        test('debe rechazar contenido null', () => {
            const result = ContentModerationService.validateContent(null);
            expect(result.isApropriate).toBe(false);
        });

        test('debe rechazar contenido muy largo', () => {
            const content = 'a'.repeat(5001);
            const result = ContentModerationService.validateContent(content);
            expect(result.isApropriate).toBe(false);
        });
    });

    describe('sanitizeContent', () => {

        test('debe limpiar espacios extra', () => {
            const content = 'Texto  con   espacios   extra';
            const sanitized = ContentModerationService.sanitizeContent(content);
            expect(sanitized).toBe('Texto con espacios extra');
        });

        test('debe eliminar HTML', () => {
            const content = '<script>alert("xss")</script> Texto';
            const sanitized = ContentModerationService.sanitizeContent(content);
            expect(sanitized).toBe('Texto');
        });

        test('debe trimear espacios al inicio y final', () => {
            const content = '  Texto  ';
            const sanitized = ContentModerationService.sanitizeContent(content);
            expect(sanitized).toBe('Texto');
        });
    });
});



import { PaymentService } from '@/memberships/domain/services/payment.service.js';

describe('PaymentService', () => {

    describe('validateCardNumber', () => {

        test('debe validar tarjeta válida', () => {
            const isValid = PaymentService.validateCardNumber('4532148803436467');
            expect(isValid).toBe(true);
        });

        test('debe rechazar tarjeta inválida', () => {
            const isValid = PaymentService.validateCardNumber('1234567890123456');
            expect(isValid).toBe(false);
        });

        test('debe rechazar tarjeta con menos de 16 dígitos', () => {
            const isValid = PaymentService.validateCardNumber('453214880343646');
            expect(isValid).toBe(false);
        });

        test('debe rechazar tarjeta con más de 16 dígitos', () => {
            const isValid = PaymentService.validateCardNumber('45321488034364670');
            expect(isValid).toBe(false);
        });
    });

    describe('validateExpiry', () => {

        test('debe validar fecha futura válida', () => {
            const nextYear = new Date().getFullYear() + 1;
            const isValid = PaymentService.validateExpiry('12', String(nextYear));
            expect(isValid).toBe(true);
        });

        test('debe rechazar fecha pasada', () => {
            const lastYear = new Date().getFullYear() - 1;
            const isValid = PaymentService.validateExpiry('12', String(lastYear));
            expect(isValid).toBe(false);
        });

        test('debe rechazar mes pasado del año actual', () => {
            const currentYear = new Date().getFullYear();
            const lastMonth = new Date().getMonth(); // Meses anteriores
            const isValid = PaymentService.validateExpiry(String(lastMonth).padStart(2, '0'), String(currentYear));
            expect(isValid).toBe(false);
        });
    });

    describe('validateCVV', () => {

        test('debe validar CVV de 3 dígitos', () => {
            const isValid = PaymentService.validateCVV('123');
            expect(isValid).toBe(true);
        });

        test('debe validar CVV de 4 dígitos', () => {
            const isValid = PaymentService.validateCVV('1234');
            expect(isValid).toBe(true);
        });

        test('debe rechazar CVV de 2 dígitos', () => {
            const isValid = PaymentService.validateCVV('12');
            expect(isValid).toBe(false);
        });

        test('debe rechazar CVV no numérico', () => {
            const isValid = PaymentService.validateCVV('abc');
            expect(isValid).toBe(false);
        });
    });

    describe('validateCardData', () => {

        test('debe validar datos completos válidos', () => {
            const validation = PaymentService.validateCardData({
                cardNumber: '4532148803436467',
                month: '12',
                year: String(new Date().getFullYear() + 1),
                cvv: '123',
                holderName: 'Juan Pérez'
            });
            expect(validation.isValid).toBe(true);
            expect(validation.errors.length).toBe(0);
        });

        test('debe detectar múltiples errores', () => {
            const validation = PaymentService.validateCardData({
                cardNumber: '123',
                month: '13',
                year: '2020',
                cvv: 'abc',
                holderName: ''
            });
            expect(validation.isValid).toBe(false);
            expect(validation.errors.length).toBeGreaterThan(0);
        });
    });
});



import { PasswordRecoveryService } from '@/auth/domain/services/password-recovery.service.js';

describe('PasswordRecoveryService', () => {

    describe('isValidEmail', () => {

        test('debe validar email válido', () => {
            const isValid = PasswordRecoveryService.isValidEmail('test@example.com');
            expect(isValid).toBe(true);
        });

        test('debe rechazar email sin @', () => {
            const isValid = PasswordRecoveryService.isValidEmail('testexample.com');
            expect(isValid).toBe(false);
        });

        test('debe rechazar email sin dominio', () => {
            const isValid = PasswordRecoveryService.isValidEmail('test@');
            expect(isValid).toBe(false);
        });
    });

    describe('generateRecoveryToken', () => {

        test('debe generar token único', () => {
            const token1 = PasswordRecoveryService.generateRecoveryToken('test@example.com');
            const token2 = PasswordRecoveryService.generateRecoveryToken('test@example.com');
            expect(token1).not.toBe(token2);
        });

        test('token debe tener longitud válida', () => {
            const token = PasswordRecoveryService.generateRecoveryToken('test@example.com');
            expect(token.length).toBeGreaterThan(0);
        });
    });

    describe('validateRecoveryToken', () => {

        test('debe validar token válido', () => {
            const token = PasswordRecoveryService.generateRecoveryToken('test@example.com');
            const tokenData = PasswordRecoveryService.validateRecoveryToken(token);
            expect(tokenData).not.toBeNull();
            expect(tokenData.email).toBe('test@example.com');
        });

        test('debe rechazar token inválido', () => {
            const tokenData = PasswordRecoveryService.validateRecoveryToken('token_invalido');
            expect(tokenData).toBeNull();
        });

        test('debe rechazar token usado', () => {
            const token = PasswordRecoveryService.generateRecoveryToken('test@example.com');
            PasswordRecoveryService.markTokenAsUsed(token);
            const tokenData = PasswordRecoveryService.validateRecoveryToken(token);
            expect(tokenData).toBeNull();
        });
    });
});



import { PromotionEntity } from '@/promotions/domain/model/promotion.entity.js';

describe('PromotionEntity', () => {

    let promotion;

    beforeEach(() => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días en el futuro

        promotion = new PromotionEntity({
            id: 1,
            title: '2x1 Pollo',
            discount: 50,
            startDate: now.toISOString(),
            endDate: futureDate.toISOString(),
            maxUses: 100,
            currentUses: 25
        });
    });

    describe('isActive', () => {

        test('debe retornar true para promoción activa', () => {
            expect(promotion.isActive()).toBe(true);
        });

        test('debe retornar false para promoción expirada', () => {
            const pastDate = new Date(Date.now() - 1000);
            promotion.endDate = pastDate;
            expect(promotion.isActive()).toBe(false);
        });
    });

    describe('hasExpired', () => {

        test('debe retornar true para fecha pasada', () => {
            promotion.endDate = new Date(Date.now() - 1000);
            expect(promotion.hasExpired()).toBe(true);
        });

        test('debe retornar false para fecha futura', () => {
            expect(promotion.hasExpired()).toBe(false);
        });
    });

    describe('isFull', () => {

        test('debe retornar true cuando se alcanza cupo', () => {
            promotion.currentUses = promotion.maxUses;
            expect(promotion.isFull()).toBe(true);
        });

        test('debe retornar false cuando no hay cupo límite', () => {
            promotion.maxUses = 0;
            expect(promotion.isFull()).toBe(false);
        });

        test('debe retornar false cuando hay cupo disponible', () => {
            expect(promotion.isFull()).toBe(false);
        });
    });

    describe('incrementUse', () => {

        test('debe incrementar uso si hay cupo', () => {
            const beforeUse = promotion.currentUses;
            const success = promotion.incrementUse();
            expect(success).toBe(true);
            expect(promotion.currentUses).toBe(beforeUse + 1);
        });

        test('debe retornar false si se alcanzó cupo', () => {
            promotion.currentUses = promotion.maxUses;
            const success = promotion.incrementUse();
            expect(success).toBe(false);
        });
    });

    describe('getUsagePercentage', () => {

        test('debe calcular porcentaje correcto', () => {
            promotion.currentUses = 25;
            promotion.maxUses = 100;
            const percentage = promotion.getUsagePercentage();
            expect(percentage).toBe(25);
        });

        test('debe retornar 0 si no hay límite', () => {
            promotion.maxUses = 0;
            const percentage = promotion.getUsagePercentage();
            expect(percentage).toBe(0);
        });
    });
});
