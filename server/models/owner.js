// server/models/Owner.js
import { dbQuery } from "../config/db.js";

class Owner {
  static async getOwnerDashboard(ownerId) {
    try {
      const stats = await dbQuery(
        `
        SELECT 
          (SELECT COUNT(*) FROM properties WHERE owner_id = ?) as totalListings,
          (SELECT COUNT(*) FROM properties WHERE owner_id = ? AND status = 'approved') as approvedListings,
          (SELECT COUNT(*) FROM properties WHERE owner_id = ? AND status = 'pending') as pendingListings,
          (SELECT COUNT(*) FROM properties WHERE owner_id = ? AND status = 'rejected') as rejectedListings,
          (SELECT COUNT(*) FROM properties WHERE owner_id = ? AND availability = 'rented') as rentedListings
      `,
        [ownerId, ownerId, ownerId, ownerId, ownerId],
      );

      return stats[0];
    } catch (error) {
      throw new Error("Failed to fetch owner stats: " + error.message);
    }
  }
}

export default Owner;
