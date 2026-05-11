import { dbQuery, dbRun } from "../config/db.js";

// ==========================================
// 📊 DASHBOARD STATS
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dbQuery(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'tenant') as "totalTenants",
        (SELECT COUNT(*) FROM users WHERE role = 'owner') as "totalPartners",
        (SELECT COUNT(*) FROM users WHERE role = 'owner' AND is_approved = FALSE) as "pendingPartners",
        (SELECT COUNT(*) FROM properties) as "totalProperties",
        (SELECT COUNT(*) FROM properties WHERE status = 'pending') as "pendingProperties",
        (SELECT COUNT(*) FROM properties WHERE status = 'approved') as "activeProperties"
    `);

    // PostgreSQL returns COUNT as a string, so we map them to Numbers safely
    const formattedStats = {
      totalTenants: Number(stats[0].totalTenants || 0),
      totalPartners: Number(stats[0].totalPartners || 0),
      pendingPartners: Number(stats[0].pendingPartners || 0),
      totalProperties: Number(stats[0].totalProperties || 0),
      pendingProperties: Number(stats[0].pendingProperties || 0),
      activeProperties: Number(stats[0].activeProperties || 0),
    };

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==========================================
// 👤 ADMIN PROFILE
// ==========================================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await dbQuery(
      "SELECT id, name, email, mobile, role, created_at FROM users WHERE id = ?",
      [req.user.id],
    );

    if (!admin.length) {
      return res.status(404).json({ error: "Admin not found." });
    }

    res.status(200).json(admin[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

export const updateAdminProfile = async (req, res) => {
  const { name, mobile } = req.body;
  try {
    await dbRun("UPDATE users SET name = ?, mobile = ? WHERE id = ?", [
      name,
      mobile,
      req.user.id,
    ]);
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
};

// ==========================================
// 🤝 PARTNER (OWNER) MANAGEMENT
// ==========================================
// Fetch partners based on status
export const getPartners = async (req, res) => {
  const { status } = req.query; // 'pending' or 'approved'

  // PostgreSQL strictly requires actual booleans (true/false) instead of 1/0
  const is_approved = status === "approved" ? true : false;

  try {
    const partners = await dbQuery(
      "SELECT id, name, email, mobile, documents, is_approved, created_at FROM users WHERE role = 'owner' AND is_approved = ?",
      [is_approved],
    );
    res.status(200).json(partners);
  } catch (error) {
    console.error("Fetch Partners Error:", error);
    res.status(500).json({ error: "Failed to fetch partners." });
  }
};

// Approve or Reject a partner account
export const updatePartnerStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // Expects 'approve' or 'reject'

  if (!["approve", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'approve' or 'reject'." });
  }

  // True for approve, False for reject/pending
  const is_approved = action === "approve" ? true : false;

  try {
    await dbRun(
      "UPDATE users SET is_approved = ? WHERE id = ? AND role = 'owner'",
      [is_approved, id],
    );
    res
      .status(200)
      .json({ message: `Partner account ${action}d successfully.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update partner status." });
  }
};

// ==========================================
// 🏠 PROPERTY MANAGEMENT
// ==========================================
export const getProperties = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let baseQuery = `FROM properties p JOIN users u ON p.owner_id = u.id`;
    let whereClause = ``;
    let params = [];

    if (["pending", "approved", "rejected"].includes(status)) {
      whereClause = `WHERE p.status = ?`;
      params.push(status);
    }

    // 1. Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total ${baseQuery} ${whereClause}`;
    const countResult = await dbQuery(countQuery, params);

    // Convert Postgres String Count to Number
    const totalItems = Number(countResult[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Get paginated data
    const dataQuery = `
      SELECT p.*, u.name as owner_name, u.mobile as owner_mobile, u.email as owner_email
      ${baseQuery} ${whereClause}
      ORDER BY p.created_at DESC LIMIT ? OFFSET ?
    `;

    // Add pagination params
    params.push(Number(limit), Number(offset));
    const properties = await dbQuery(dataQuery, params);

    res.status(200).json({
      properties,
      pagination: {
        totalItems,
        totalPages,
        currentPage: Number(page),
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get Properties Error:", error);
    res.status(500).json({ error: "Failed to fetch properties." });
  }
};

// Existing single update
export const updatePropertyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    await dbRun("UPDATE properties SET status = ? WHERE id = ?", [status, id]);
    res.status(200).json({ message: `Property marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update property status." });
  }
};

// NEW: Bulk Update Properties
export const bulkUpdatePropertyStatus = async (req, res) => {
  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No properties selected." });
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    // Create placeholders for the SQL IN clause (e.g., ?, ?, ?)
    // Our custom dbConfig wrapper will automatically translate these to Postgres $1, $2, $3 formats!
    const placeholders = ids.map(() => "?").join(",");
    const query = `UPDATE properties SET status = ? WHERE id IN (${placeholders})`;

    // params array will be [status, id1, id2, id3...]
    await dbRun(query, [status, ...ids]);

    res
      .status(200)
      .json({ message: `Successfully ${status} ${ids.length} properties.` });
  } catch (error) {
    console.error("Bulk Update Error:", error);
    res.status(500).json({ error: "Failed to process bulk update." });
  }
};
