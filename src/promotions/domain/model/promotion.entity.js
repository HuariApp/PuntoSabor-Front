export class PromotionEntity {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.huariqueId = data.huariqueId;
        this.ownerId = data.ownerId;
        this.discount = data.discount;
        this.maxUses = data.maxUses;
        this.currentUses = data.currentUses || 0;
        this.startDate = new Date(data.startDate);
        this.endDate = new Date(data.endDate);
        this.featured = data.featured !== false;
        this.status = data.status || 'active';
        this.createdAt = new Date(data.createdAt || Date.now());
    }

    /**
     * Verifica si la promoción está activa
     */
    isActive() {
        const now = new Date();
        return this.status === 'active' &&
            now >= this.startDate &&
            now <= this.endDate;
    }

    /**
     * Verifica si ha expirado
     */
    hasExpired() {
        return new Date() > this.endDate;
    }

    /**
     * Verifica si se alcanzó el cupo
     */
    isFull() {
        return this.maxUses > 0 && this.currentUses >= this.maxUses;
    }

    /**
     * Obtiene estado legible
     */
    getStatus() {
        if (this.hasExpired()) {
            return 'expired';
        }
        if (!this.isActive()) {
            return 'inactive';
        }
        if (this.isFull()) {
            return 'full';
        }
        return 'active';
    }

    /**
     * Incrementa usos
     */
    incrementUse() {
        if (!this.isFull()) {
            this.currentUses++;
            return true;
        }
        return false;
    }

    /**
     * Obtiene días restantes
     */
    getDaysRemaining() {
        const now = new Date();
        const diffTime = Math.abs(this.endDate - now);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Obtiene porcentaje de cupo usado
     */
    getUsagePercentage() {
        if (this.maxUses === 0) return 0;
        return Math.round((this.currentUses / this.maxUses) * 100);
    }
}
