const INAPPROPRIATE_WORDS = [
    'ofensa', 'insulto', 'maldición', 'groserías', 'spam',
    'discriminación', 'racismo', 'sexismo', 'abuso', 'amenaza',

];

const SPAM_PATTERNS = [
    /http[s]?:\/\//gi,
    /\$\d+/g,
    /[A-Z]{5,}/g,
];

export class ContentModerationService {
    /**
     * Valida si el contenido es apropiado
     * @param {string} content
     * @returns {Object} { isApropriate: boolean, reason: string }
     */
    static validateContent(content) {
        if (!content || typeof content !== 'string') {
            return { isApropriate: false, reason: 'Contenido vacío o inválido' };
        }

        const lowerContent = content.toLowerCase();

        for (const word of INAPPROPRIATE_WORDS) {
            if (lowerContent.includes(word)) {
                return {
                    isApropriate: false,
                    reason: `Contenido inapropiado detectado: lenguaje ofensivo`
                };
            }
        }

        for (const pattern of SPAM_PATTERNS) {
            if (pattern.test(content)) {
                return {
                    isApropriate: false,
                    reason: `Posible contenido de spam detectado`
                };
            }
        }

        if (content.length > 5000) {
            return {
                isApropriate: false,
                reason: `Contenido demasiado largo (máx 5000 caracteres)`
            };
        }

        return { isApropriate: true, reason: 'Contenido válido' };
    }

    /**
     * Limpia y sanitiza el contenido
     * @param {string} content - Contenido a limpiar
     * @returns {string} Contenido sanitizado
     */
    static sanitizeContent(content) {
        return content
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/<[^>]*>/g, '');
    }
}
