export class Review {
    constructor({ id = null, huariqueId, userId, rating, comment, createdAt = new Date().toISOString() }) {
        this.id = id;
        this.huariqueId = Number(huariqueId);
        this.userId = Number(userId ?? 0);
        this.rating = Number(rating);      // 1..5
        this.comment = String(comment ?? '').trim();
        this.createdAt = createdAt;
    }
}
