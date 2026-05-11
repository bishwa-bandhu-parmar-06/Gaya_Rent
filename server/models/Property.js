import { dbQuery, dbRun } from "../config/db.js";

class Property {
  static async create(ownerId, data) {
    const { title, location, type, rent, size, furnishing, photos } = data;
    const query = `
      INSERT INTO properties (owner_id, title, location, type, rent, size, furnishing, photos, status, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'available')
      RETURNING id
    `;
    const result = await dbRun(query, [
      ownerId,
      title,
      location,
      type,
      rent,
      size,
      furnishing,
      photos,
    ]);
    return result.lastID;
  }

  static async findByOwner(ownerId) {
    const query = `SELECT * FROM properties WHERE owner_id = ? ORDER BY created_at DESC`;
    return await dbQuery(query, [ownerId]);
  }

  static async findByIdAndOwner(id, ownerId) {
    const query = `SELECT * FROM properties WHERE id = ? AND owner_id = ?`;
    const properties = await dbQuery(query, [id, ownerId]);
    return properties.length ? properties[0] : null;
  }

  static async update(id, ownerId, data) {
    const { title, location, type, rent, size, furnishing, photos } = data;
    const query = `
      UPDATE properties 
      SET title = ?, location = ?, type = ?, rent = ?, size = ?, furnishing = ?, photos = ?, status = 'pending'
      WHERE id = ? AND owner_id = ?
    `;
    return await dbRun(query, [
      title,
      location,
      type,
      rent,
      size,
      furnishing,
      photos,
      id,
      ownerId,
    ]);
  }

  static async delete(id, ownerId) {
    const query = `DELETE FROM properties WHERE id = ? AND owner_id = ?`;
    return await dbRun(query, [id, ownerId]);
  }

  static async updateAvailability(id, ownerId, availability) {
    const query = `UPDATE properties SET availability = ? WHERE id = ? AND owner_id = ?`;
    return await dbRun(query, [availability, id, ownerId]);
  }
}

export default Property;



















// import { dbQuery, dbRun } from "../config/db.js";

// class Property {
//   static async create(ownerId, data) {
//     const { title, location, type, rent, size, furnishing, photos } = data;
//     const query = `
//       INSERT INTO properties (owner_id, title, location, type, rent, size, furnishing, photos, status, availability)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'available')
//     `;
//     const result = await dbRun(query, [
//       ownerId,
//       title,
//       location,
//       type,
//       rent,
//       size,
//       furnishing,
//       photos,
//     ]);
//     return result.lastID;
//   }

//   static async findByOwner(ownerId) {
//     const query = `SELECT * FROM properties WHERE owner_id = ? ORDER BY created_at DESC`;
//     return await dbQuery(query, [ownerId]);
//   }

//   static async findByIdAndOwner(id, ownerId) {
//     const query = `SELECT * FROM properties WHERE id = ? AND owner_id = ?`;
//     const properties = await dbQuery(query, [id, ownerId]);
//     return properties.length ? properties[0] : null;
//   }

//   static async update(id, ownerId, data) {
//     // Only allow updating certain fields, and revert status to pending upon edit
//     const { title, location, type, rent, size, furnishing, photos } = data;
//     const query = `
//       UPDATE properties 
//       SET title = ?, location = ?, type = ?, rent = ?, size = ?, furnishing = ?, photos = ?, status = 'pending'
//       WHERE id = ? AND owner_id = ?
//     `;
//     return await dbRun(query, [
//       title,
//       location,
//       type,
//       rent,
//       size,
//       furnishing,
//       photos,
//       id,
//       ownerId,
//     ]);
//   }

//   static async delete(id, ownerId) {
//     const query = `DELETE FROM properties WHERE id = ? AND owner_id = ?`;
//     return await dbRun(query, [id, ownerId]);
//   }

//   static async updateAvailability(id, ownerId, availability) {
//     const query = `UPDATE properties SET availability = ? WHERE id = ? AND owner_id = ?`;
//     return await dbRun(query, [availability, id, ownerId]);
//   }
// }

// export default Property;
