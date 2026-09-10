/**
 * Value Object: ReportField
 */
export const ReportField = Object.freeze({
    ADDRESS: 'address',
    HOURS: 'hours',
    STATUS: 'status',
});
export function isValidField(v) {
    return Object.values(ReportField).includes(v);
}
