import { dbQuery, dbRun } from "../config/db.js";
import Owner from "../models/owner.js";
import Property from "../models/Property.js";

// ==========================================
// 📊 DASHBOARD & PROFILE
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Owner.getOwnerDashboard(req.user.id);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats." });
  }
};

export const getOwnerProfile = async (req, res) => {
  try {
    const profile = await dbQuery(
      "SELECT id, name, email, mobile, address, occupation, documents, is_approved FROM users WHERE id = ?",
      [req.user.id],
    );

    if (!profile.length)
      return res.status(404).json({ error: "Profile not found." });

    res.status(200).json(profile[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

export const updateOwnerProfile = async (req, res) => {
  const { name, mobile, address, occupation } = req.body;
  try {
    await dbRun(
      "UPDATE users SET name = ?, mobile = ?, address = ?, occupation = ? WHERE id = ?",
      [name, mobile, address, occupation, req.user.id],
    );
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
};

// ==========================================
// 🏠 PROPERTY MANAGEMENT
// ==========================================
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findByOwner(req.user.id);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties." });
  }
};

export const addProperty = async (req, res) => {
  try {
    // If images were uploaded, req.files will contain the Cloudinary URLs
    const photosArray = req.files ? req.files.map((file) => file.path) : [];
    const photosJson = JSON.stringify(photosArray);

    const propertyData = { ...req.body, photos: photosJson };

    const propertyId = await Property.create(req.user.id, propertyData);
    res.status(201).json({
      message: "Property listed, pending admin approval.",
      id: propertyId,
    });
  } catch (error) {
    console.error("Add Property Error:", error);
    res.status(500).json({ error: "Failed to add property." });
  }
};

export const editProperty = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Verify Ownership
    const property = await Property.findByIdAndOwner(id, req.user.id);
    if (!property)
      return res
        .status(404)
        .json({ error: "Property not found or unauthorized." });

    // 2. Handle Images (Keep existing if no new ones, or replace)
    let photosJson = property.photos;
    if (req.files && req.files.length > 0) {
      const photosArray = req.files.map((file) => file.path);
      photosJson = JSON.stringify(photosArray);
    } else if (req.body.photos) {
      // Allow passing existing photos array if no new files
      photosJson = req.body.photos;
    }

    const updatedData = { ...req.body, photos: photosJson };
    await Property.update(id, req.user.id, updatedData);

    res.status(200).json({
      message:
        "Property updated successfully. Status reverted to pending for review.",
    });
  } catch (error) {
    console.error("Edit Property Error:", error);
    res.status(500).json({ error: "Failed to edit property." });
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Property.delete(id, req.user.id);

    // .changes works here because our dbRun wrapper converts Postgres' res.rowCount to .changes
    if (result.changes === 0)
      return res
        .status(404)
        .json({ error: "Property not found or unauthorized." });

    res.status(200).json({ message: "Property deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property." });
  }
};

export const togglePropertyAvailability = async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body; // 'available' or 'rented'

  if (!["available", "rented"].includes(availability)) {
    return res.status(400).json({ error: "Invalid availability status." });
  }

  try {
    const result = await Property.updateAvailability(
      id,
      req.user.id,
      availability,
    );

    if (result.changes === 0)
      return res
        .status(404)
        .json({ error: "Property not found or unauthorized." });

    res.status(200).json({ message: `Property marked as ${availability}.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update availability." });
  }
};

// ==========================================
// 📂 BULK ACTIONS
// ==========================================
export const bulkUploadProperties = async (req, res) => {
  try {
    const { properties } = req.body;

    if (!Array.isArray(properties) || properties.length === 0) {
      return res
        .status(400)
        .json({
          error: "Invalid data format. Expected an array of properties.",
        });
    }

    let successCount = 0;

    for (const prop of properties) {
      // If the CSV included image URLs separated by pipes/semicolons, parse them. Otherwise, empty array.
      const photosArray = prop.photos
        ? prop.photos.split("|").map((url) => url.trim())
        : [];
      const photosJson = JSON.stringify(photosArray);

      const propertyData = {
        title: prop.title,
        location: prop.location,
        type: prop.type || "Apartment",
        // Rent comes in as a string from CSV, we convert it to Number for Postgres Numeric column
        rent: Number(prop.rent),
        size: prop.size,
        furnishing: prop.furnishing || "Unfurnished",
        photos: photosJson,
      };

      await Property.create(req.user.id, propertyData);
      successCount++;
    }

    res
      .status(201)
      .json({
        message: `Successfully uploaded ${successCount} properties. Pending admin approval.`,
      });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({ error: "Failed to process bulk upload." });
  }
};
