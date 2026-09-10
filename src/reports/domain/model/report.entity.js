export class Report {
    constructor({
                    id = null,
                    huariqueId,
                    field = 'address',
                    currentValue = '',
                    suggestedValue = '',
                    comment = '',
                    status = 'open',
                    createdAt = new Date().toISOString(),
                    resolvedAt = null,
                    userId = null,
                } = {}) {
        this.id = id ?? null;
        this.huariqueId = Number(huariqueId);
        this.field = String(field);
        this.currentValue = String(currentValue ?? '');
        this.suggestedValue = String(suggestedValue ?? '');
        this.comment = String(comment ?? '');
        this.status = String(status);
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.userId = userId;
    }
}
