import { dbQuery, dbRun } from "../config/db.js";
import Property from "../models/Property.js";

// ==========================================
// 🔍 SEARCH PROPERTIES
// ==========================================
export const searchProperties = async (req, res) => {
  const { location, maxRent, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const properties = await Property.searchApproved({
      location,
      maxRent,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Ensure numeric fields are cast correctly from Postgres Strings
    const formattedProperties = properties.map((prop) => ({
      ...prop,
      rent: Number(prop.rent),
    }));

    res.status(200).json(formattedProperties);
  } catch (error) {
    console.error("Search Properties Error:", error);
    res.status(500).json({ error: "Failed to search properties." });
  }
};

// ==========================================
// 👤 TENANT PROFILE
// ==========================================
export const getTenantProfile = async (req, res) => {
  try {
    const profile = await dbQuery(
      "SELECT id, name, email, mobile, address, occupation, created_at FROM users WHERE id = ?",
      [req.user.id],
    );

    if (!profile.length) {
      return res.status(404).json({ error: "Profile not found." });
    }

    res.status(200).json(profile[0]);
  } catch (error) {
    console.error("Get Tenant Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

export const updateTenantProfile = async (req, res) => {
  const { name, mobile, address, occupation } = req.body;

  try {
    await dbRun(
      "UPDATE users SET name = ?, mobile = ?, address = ?, occupation = ? WHERE id = ?",
      [name, mobile, address, occupation, req.user.id],
    );
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update Tenant Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

// ==========================================
// ⭐ RATINGS & REVIEWS
// ==========================================
export const rateProperty = async (req, res) => {
  const { id: propertyId } = req.params;
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  try {
    const photosArray = req.files ? req.files.map((file) => file.path) : [];
    const photosJson = JSON.stringify(photosArray);

    const existingRating = await dbQuery(
      "SELECT id FROM ratings WHERE property_id = ? AND tenant_id = ?",
      [propertyId, req.user.id],
    );

    if (existingRating.length) {
      await dbRun(
        "UPDATE ratings SET rating = ?, review = ?, photos = ? WHERE id = ?",
        [rating, review || "", photosJson, existingRating[0].id],
      );
      return res.status(200).json({ message: "Rating updated." });
    } else {
      await dbRun(
        "INSERT INTO ratings (property_id, tenant_id, rating, review, photos) VALUES (?, ?, ?, ?, ?)",
        [propertyId, req.user.id, rating, review || "", photosJson],
      );
      return res.status(201).json({ message: "Rating submitted." });
    }
  } catch (error) {
    console.error("Rate Property Error:", error);
    res.status(500).json({ error: "Failed to submit rating." });
  }
};

export const getRatedProperties = async (req, res) => {
  try {
    const query = `
      SELECT p.*, r.rating as my_rating, r.review as my_review 
      FROM properties p
      JOIN ratings r ON p.id = r.property_id
      WHERE r.tenant_id = ?
    `;
    const properties = await dbQuery(query, [req.user.id]);

    // Ensure numeric fields are cast correctly
    const formattedProperties = properties.map((prop) => ({
      ...prop,
      rent: Number(prop.rent),
    }));

    res.status(200).json(formattedProperties);
  } catch (error) {
    console.error("Get Rated Properties Error:", error);
    res.status(500).json({ error: "Failed to fetch rated properties." });
  }
};

// ==========================================
// ❤️ SAVED PROPERTIES
// ==========================================
export const toggleSaveProperty = async (req, res) => {
  const { propertyId } = req.body;
  const tenantId = req.user.id;

  try {
    const existing = await dbQuery(
      "SELECT id FROM saved_properties WHERE user_id = ? AND property_id = ?",
      [tenantId, propertyId],
    );

    if (existing.length > 0) {
      await dbRun(
        "DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?",
        [tenantId, propertyId],
      );
      return res
        .status(200)
        .json({ message: "Property removed from saved list.", isSaved: false });
    } else {
      await dbRun(
        "INSERT INTO saved_properties (user_id, property_id) VALUES (?, ?)",
        [tenantId, propertyId],
      );
      return res
        .status(200)
        .json({ message: "Property saved successfully.", isSaved: true });
    }
  } catch (error) {
    console.error("Toggle Save Error:", error);
    res.status(500).json({ error: "Failed to toggle saved property." });
  }
};

export const getSavedProperties = async (req, res) => {
  const tenantId = req.user.id;

  try {
    const query = `
      SELECT p.* FROM properties p
      JOIN saved_properties sp ON p.id = sp.property_id
      WHERE sp.user_id = ?
    `;
    const properties = await dbQuery(query, [tenantId]);

    const formattedProperties = properties.map((prop) => ({
      ...prop,
      rent: Number(prop.rent),
    }));

    res.status(200).json(formattedProperties);
  } catch (error) {
    console.error("Get Saved Properties Error:", error);
    res.status(500).json({ error: "Failed to fetch saved properties." });
  }
};

export const checkSavedStatus = async (req, res) => {
  const { id } = req.params;
  const tenantId = req.user.id;

  try {
    const existing = await dbQuery(
      "SELECT id FROM saved_properties WHERE user_id = ? AND property_id = ?",
      [tenantId, id],
    );
    res.status(200).json({ isSaved: existing.length > 0 });
  } catch (error) {
    console.error("Check Saved Status Error:", error);
    res.status(500).json({ error: "Failed to check saved status." });
  }
};
