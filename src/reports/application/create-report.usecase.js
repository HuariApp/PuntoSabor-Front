import { Report } from '@/reports/domain/model/report.entity.js';
import { isValidField } from '@/reports/domain/model/report-field.vo.js';
import { ReportsRepository } from '@/reports/infrastructure/reports.repository.js';

/**
 * Crea un reporte (status=open).
 * Valida el huarique, el campo reportado y el valor sugerido antes de
 * construir la entidad `Report` y persistirla.
 *
 * @param {{ huariqueId: number|string, field: string, currentValue?: *, suggestedValue: *, comment?: string, userId?: number|string }} input
 *   Datos del reporte a crear.
 * @returns {Promise<object>} Reporte creado.
 * @throws {Error} Si falta el huarique, el campo es inválido o no hay valor sugerido.
 */
export async function createReportUseCase(input) {
    if (!input?.huariqueId) throw new Error('huariqueId requerido');
    if (!isValidField(input.field)) throw new Error('Campo inválido');
    if (!String(input.suggestedValue ?? '').trim()) throw new Error('Valor sugerido requerido');

    const report = new Report({
        ...input,
        huariqueId: Number(input.huariqueId),
        status: 'open',
        createdAt: new Date().toISOString(),
    });

    return ReportsRepository.create(report);
}
