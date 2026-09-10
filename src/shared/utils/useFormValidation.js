import { ref, computed } from 'vue';

/**
 * Composable de validación de formularios.
 * Ofrece un conjunto de reglas reutilizables y utilidades para validar
 * campos individuales o formularios completos, además de rastrear qué
 * campos han sido "tocados" por el usuario.
 *
 * Cada regla devuelve un string vacío cuando el valor es válido o el
 * mensaje de error correspondiente cuando no lo es.
 *
 * @returns {object} Estado reactivo (`errors`, `touched`), el catálogo de
 *   `rules` y los helpers `validate`, `validateAll`, `markTouched`,
 *   `resetForm` y el computed `hasErrors`.
 */
export function useFormValidation() {
    const errors = ref({});
    const touched = ref({});

    const rules = {
        required: (value) => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return 'Este campo es requerido';
            }
            return '';
        },

        email: (value) => {
            if (!value) return '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? '' : 'Email inválido';
        },

        minLength: (min) => (value) => {
            if (!value) return '';
            return value.length >= min ? '' : `Mínimo ${min} caracteres`;
        },

        maxLength: (max) => (value) => {
            if (!value) return '';
            return value.length <= max ? '' : `Máximo ${max} caracteres`;
        },

        phone: (value) => {
            if (!value) return '';
            const phoneRegex = /^[0-9]{7,15}$/;
            return phoneRegex.test(value.replace(/\D/g, '')) ? '' : 'Teléfono inválido';
        },

        number: (value) => {
            return isNaN(value) || value === '' ? 'Debe ser un número' : '';
        },

        url: (value) => {
            if (!value) return '';
            try {
                new URL(value);
                return '';
            } catch {
                return 'URL inválida';
            }
        },

        minValue: (min) => (value) => {
            if (value === '' || value === null || value === undefined) return '';
            return Number(value) >= min ? '' : `El valor mínimo es ${min}`;
        },

        maxValue: (max) => (value) => {
            if (value === '' || value === null || value === undefined) return '';
            return Number(value) <= max ? '' : `El valor máximo es ${max}`;
        },

        match: (compareValue, message = 'Los valores no coinciden') => (value) => {
            return value === compareValue ? '' : message;
        },

        pattern: (regex, message = 'Formato inválido') => (value) => {
            if (!value) return '';
            return regex.test(value) ? '' : message;
        }
    };

    /**
     * Valida un único campo aplicando sus reglas en orden.
     * Actualiza `errors` con el primer mensaje encontrado (o lo limpia).
     * @param {string} fieldName Nombre del campo dentro del formulario.
     * @param {*} value Valor actual del campo.
     * @param {Array<Function>} [fieldRules=[]] Reglas a aplicar sobre el valor.
     * @returns {boolean} `true` si el campo es válido.
     */
    const validate = (fieldName, value, fieldRules = []) => {
        const fieldErrors = [];

        for (const rule of fieldRules) {
            const error = rule(value);
            if (error) fieldErrors.push(error);
        }

        if (fieldErrors.length > 0) {
            errors.value[fieldName] = fieldErrors[0];
        } else {
            delete errors.value[fieldName];
        }

        return fieldErrors.length === 0;
    };

    /**
     * Valida un formulario completo contra un mapa de reglas por campo.
     * Reemplaza `errors` con todos los errores detectados.
     * @param {Record<string, *>} formData Valores del formulario por campo.
     * @param {Record<string, Array<Function>>} formRules Reglas por campo.
     * @returns {boolean} `true` si todo el formulario es válido.
     */
    const validateAll = (formData, formRules) => {
        const newErrors = {};

        for (const [fieldName, fieldRules] of Object.entries(formRules)) {
            const value = formData[fieldName];
            const fieldErrors = [];

            for (const rule of fieldRules) {
                const error = rule(value);
                if (error) fieldErrors.push(error);
            }

            if (fieldErrors.length > 0) {
                newErrors[fieldName] = fieldErrors[0];
            }
        }

        errors.value = newErrors;
        return Object.keys(newErrors).length === 0;
    };

    const markTouched = (fieldName) => {
        touched.value[fieldName] = true;
    };

    const resetForm = () => {
        errors.value = {};
        touched.value = {};
    };

    const hasErrors = computed(() => Object.keys(errors.value).length > 0);

    return {
        errors,
        touched,
        rules,
        validate,
        validateAll,
        markTouched,
        resetForm,
        hasErrors
    };
}
