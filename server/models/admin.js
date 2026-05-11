import { dbQuery, dbRun } from "../config/db.js";

class Admin {
  static async getDashboardStats() {
    try {
      const totalUsers = await dbQuery("SELECT COUNT(*) as count FROM users");
      const totalProperties = await dbQuery("SELECT COUNT(*) as count FROM properties");
      const pendingProperties = await dbQuery("SELECT COUNT(*) as count FROM properties WHERE status = 'pending'");
      
      return {
        totalUsers: Number(totalUsers[0].count),
        totalProperties: Number(totalProperties[0].count),
        pendingProperties: Number(pendingProperties[0].count),
      };
    } catch (error) {
      throw new Error("Failed to fetch admin stats: " + error.message);
    }
  }

  static async getUsersByRole(role) {
    return await dbQuery("SELECT id, name, email, role, created_at FROM users WHERE role = ?", [role]);
  }

  static async deleteUser(userId) {
    return await dbRun("DELETE FROM users WHERE id = ?", [userId]);
  }
}

export default Admin;


















// import { dbQuery, dbRun } from "../config/db.js";

// class Admin {
//   // Get analytics for the admin dashboard
//   static async getDashboardStats() {
//     try {
//       const totalUsers = await dbQuery("SELECT COUNT(*) as count FROM users");
//       const totalProperties = await dbQuery("SELECT COUNT(*) as count FROM properties");
//       const pendingProperties = await dbQuery("SELECT COUNT(*) as count FROM properties WHERE status = 'pending'");
      
//       return {
//         totalUsers: totalUsers[0].count,
//         totalProperties: totalProperties[0].count,
//         pendingProperties: pendingProperties[0].count,
//       };
//     } catch (error) {
//       throw new Error("Failed to fetch admin stats: " + error.message);
//     }
//   }

//   // Fetch all users filtered by their role (to manage owners, renters, tenants)
//   static async getUsersByRole(role) {
//     return await dbQuery("SELECT id, name, email, role, created_at FROM users WHERE role = ?", [role]);
//   }

//   // Delete a user (and conceptually, you'd cascade delete their properties)
//   static async deleteUser(userId) {
//     return await dbRun("DELETE FROM users WHERE id = ?", [userId]);
//   }
// }

// export default Admin;