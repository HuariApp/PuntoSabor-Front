/**
 * Caso de uso: enviar un mensaje del formulario de contacto.
 * Actualmente simula el envío con una pequeña espera (mock) mientras no
 * exista un backend real de contacto.
 *
 * @param {object} payload Datos del mensaje de contacto.
 * @returns {Promise<{ ok: boolean }>} Confirmación de envío.
 */
export async function sendMessageUseCase(payload){
    await new Promise(r=>setTimeout(r,400));
    return { ok:true };
}
