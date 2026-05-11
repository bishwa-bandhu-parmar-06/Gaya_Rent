import { dbQuery, dbRun } from "../config/db.js";

class User {
  static async create({
    name,
    email,
    password,
    role,
    googleId = null,
    mobile = null,
    docType = null,
    docId = null,
    documentUrl = null,
    is_approved = true, // Changed to boolean true
  }) {
    let documents = null;
    if (docType || docId || documentUrl) {
      documents = JSON.stringify([
        { type: docType, id: docId, url: documentUrl },
      ]);
    }

    const query = `
      INSERT INTO users (
        name, email, password, role, google_id, 
        mobile, documents, is_approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `;

    const result = await dbRun(query, [
      name,
      email,
      password,
      role,
      googleId,
      mobile,
      documents,
      is_approved,
    ]);

    return result.lastID;
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const users = await dbQuery(query, [email]);
    return users.length ? users[0] : null;
  }

  static async findByEmailOrMobile(loginIdOrEmail, mobile = null) {
    const query = `SELECT * FROM users WHERE email = ? OR mobile = ?`;

    const params = mobile
      ? [loginIdOrEmail, mobile]
      : [loginIdOrEmail, loginIdOrEmail];

    const users = await dbQuery(query, params);
    return users.length ? users[0] : null;
  }

  static async findById(id) {
    const query = `SELECT id, name, email, mobile, role, is_approved, created_at FROM users WHERE id = ?`;
    const users = await dbQuery(query, [id]);
    return users.length ? users[0] : null;
  }

  static async updatePassword(userId, hashedPassword) {
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    return await dbRun(query, [hashedPassword, userId]);
  }
}

export default User;

// import { dbQuery, dbRun } from "../config/db.js";

// class User {
//   static async create({
//     name,
//     email,
//     password,
//     role,
//     googleId = null,
//     mobile = null,
//     docType = null,
//     docId = null,
//     documentUrl = null,
//     is_approved = 1,
//   }) {
//     let documents = null;
//     if (docType || docId || documentUrl) {
//       documents = JSON.stringify([
//         { type: docType, id: docId, url: documentUrl },
//       ]);
//     }

//     const query = `
//       INSERT INTO users (
//         name, email, password, role, google_id,
//         mobile, documents, is_approved
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const result = await dbRun(query, [
//       name,
//       email,
//       password,
//       role,
//       googleId,
//       mobile,
//       documents,
//       is_approved,
//     ]);

//     return result.lastID;
//   }

//   static async findByEmail(email) {
//     const query = `SELECT * FROM users WHERE email = ?`;
//     const users = await dbQuery(query, [email]);
//     return users.length ? users[0] : null;
//   }

//   static async findByEmailOrMobile(loginIdOrEmail, mobile = null) {
//     const query = `SELECT * FROM users WHERE email = ? OR mobile = ?`;

//     const params = mobile
//       ? [loginIdOrEmail, mobile]
//       : [loginIdOrEmail, loginIdOrEmail];

//     const users = await dbQuery(query, params);
//     return users.length ? users[0] : null;
//   }

//   static async findById(id) {
//     const query = `SELECT id, name, email, mobile, role, is_approved, created_at FROM users WHERE id = ?`;
//     const users = await dbQuery(query, [id]);
//     return users.length ? users[0] : null;
//   }

//   static async updatePassword(userId, hashedPassword) {
//     const query = `UPDATE users SET password = ? WHERE id = ?`;
//     return await dbRun(query, [hashedPassword, userId]);
//   }
// }

// export default User;
