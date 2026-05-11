import { dbQuery } from "../config/db.js";


export const getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { search, minRent, maxRent, furnishing, bhk, minRating, sort } = req.query;

    let whereClause = `WHERE p.status = 'approved' AND p.availability = 'available'`;
    const queryParams = [];

    // 1. Text Search (Matches Title or Location)
    if (search) {
      whereClause += ` AND (p.title LIKE ? OR p.location LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // 2. Price Range
    if (minRent) {
      whereClause += ` AND p.rent >= ?`;
      queryParams.push(Number(minRent));
    }
    if (maxRent) {
      whereClause += ` AND p.rent <= ?`;
      queryParams.push(Number(maxRent));
    }

    // 3. Furnishing (Handles multiple: "Fully Furnished,Unfurnished")
    if (furnishing) {
      const furnishArr = furnishing.split(',');
      const placeholders = furnishArr.map(() => '?').join(',');
      whereClause += ` AND p.furnishing IN (${placeholders})`;
      queryParams.push(...furnishArr);
    }

    // 4. BHK / Size (Matches text like "2 BHK" or "1000 sqft")
    if (bhk) {
      const bhkArr = bhk.split(',');
      const bhkConditions = bhkArr.map(() => `p.size LIKE ?`).join(' OR ');
      whereClause += ` AND (${bhkConditions})`;
      bhkArr.forEach(b => queryParams.push(`%${b}%`));
    }

    // 5. Build the Base Query (Calculates Average Rating dynamically)
    let baseQuery = `
      SELECT p.*, u.name as owner_name, u.mobile as owner_mobile,
             COALESCE((SELECT AVG(rating) FROM ratings WHERE property_id = p.id), 0) as average_rating
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      ${whereClause}
    `;

    // 6. Filter by Minimum Rating (Must wrap in outer query since average_rating is calculated)
    if (minRating) {
      baseQuery = `SELECT * FROM (${baseQuery}) WHERE average_rating >= ?`;
      queryParams.push(Number(minRating));
    }

    // 7. Sorting Logic
    let orderBy = `ORDER BY created_at DESC`;
    if (sort === 'price_low') orderBy = `ORDER BY rent ASC`;
    if (sort === 'price_high') orderBy = `ORDER BY rent DESC`;
    if (sort === 'rating') orderBy = `ORDER BY average_rating DESC`;

    // 8. Count Total Items (For Pagination Math)
    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery})`;
    const countResult = await dbQuery(countQuery, queryParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // 9. Execute Final Paginated Query
    const paginatedQuery = `${baseQuery} ${orderBy} LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const properties = await dbQuery(paginatedQuery, queryParams);

    res.status(200).json({
      properties,
      pagination: { totalItems, totalPages, currentPage: page, itemsPerPage: limit }
    });

  } catch (error) {
    console.error("Fetch Properties Error:", error);
    res.status(500).json({ error: "Failed to fetch properties." });
  }
};

// ==========================================
// 🔍 GET SINGLE PROPERTY BY ID
// ==========================================
export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT p.*, u.name as owner_name, u.mobile as owner_mobile, u.email as owner_email 
      FROM properties p 
      JOIN users u ON p.owner_id = u.id 
      WHERE p.id = ? AND p.status = 'approved'
    `;

    const property = await dbQuery(query, [id]);

    if (!property.length) {
      return res
        .status(404)
        .json({ error: "Property not found or is no longer available." });
    }

    res.status(200).json(property[0]);
  } catch (error) {
    console.error("Fetch Property ID Error:", error);
    res.status(500).json({ error: "Failed to fetch property details." });
  }
};


// Fetch ALL reviews for a specific property (Public Route)
export const getPropertyReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT r.id, r.rating, r.review, r.photos, r.created_at, u.name as reviewer_name
      FROM ratings r
      JOIN users u ON r.tenant_id = u.id
      WHERE r.property_id = ?
      ORDER BY r.created_at DESC
    `;
    const reviews = await dbQuery(query, [id]);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
};
