import { ReportsRepository } from '@/reports/infrastructure/reports.repository.js';
import { HuariquesRepository } from '@/discovery/infrastructure/huariques.repository.js';

/**
 * Aplica la corrección del reporte al huarique y marca el reporte como "applied".
 * Primero parcha el campo del huarique con el valor sugerido y luego
 * actualiza el estado del reporte con la fecha de resolución.
 *
 * @param {{ id: number|string, huariqueId: number|string, field: string, suggestedValue: * }} report
 *   Reporte a aplicar.
 * @returns {Promise<object>} Reporte actualizado con estado "applied".
 * @throws {Error} Si faltan el id, el huarique, el campo o el valor sugerido.
 */
export async function applyReportUseCase(report) {
    if (!report || report.id == null) throw new Error('id de reporte requerido');
    const huariqueId = Number(report.huariqueId);
    if (!huariqueId) throw new Error('huariqueId requerido');

    const { field, suggestedValue } = report;
    if (!field || typeof suggestedValue === 'undefined') {
        throw new Error('Campo/sugerencia incompletos');
    }

    await HuariquesRepository.patch(huariqueId, { [field]: suggestedValue });

    return ReportsRepository.patch(report.id, {
        status: 'applied',
        resolvedAt: new Date().toISOString(),
    });
}
