# 🏡 GayaRent

GayaRent is a modern, full-stack real estate rental platform designed to connect property owners with tenants directly, eliminating brokerage fees. Built with Next.js, Express, and PostgreSQL (Supabase), the platform offers a seamless, mobile-responsive experience for property listing, discovery, and management.

---

## 🚀 Tech Stack

### **Frontend (Client)**
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS & shadcn/ui
* **State Management:** Redux Toolkit & Redux Persist
* **Icons:** Lucide React & React Icons
* **Authentication:** NextAuth / Google OAuth (Frontend wrapping)

### **Backend (Server)**
* **Framework:** Node.js & Express.js
* **Database:** PostgreSQL (via Supabase)
* **ORM/Query Builder:** Custom raw SQL wrapper (`pg` module)
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Helmet, CORS, bcrypt

---

## ✨ Key Features

* **Multi-Role Authentication:** Dedicated dashboards for Tenants, Property Owners, and Admins.
* **Property Management:** Owners can easily add, edit, and bulk-upload properties via CSV.
* **Responsive Design:** A fully mobile-optimized UI featuring a sleek slide-out sidebar, touch-friendly touch targets, and horizontal-scrolling tabs.
* **Advanced Search:** Location-based property searching with built-in Geolocation ("Near Me" functionality).
* **Direct Communication:** Tenants can connect with owners directly via WhatsApp without intermediaries.
* **Admin Controls:** Comprehensive admin dashboard to approve/reject partners and manage system analytics.

---

## 📂 Project Structure

The repository is structured as a monorepo containing both the client and server.

```text
gaya_rent/
├── client/                 # Next.js Frontend
│   ├── app/                # App Router pages (Home, Properties, Dashboards)
│   ├── components/         # Reusable UI components (Navbar, Hero, Dialogs)
│   ├── lib/store/          # Redux slices and store configuration
│   └── public/             # Static assets
└── server/                 # Express Backend
    ├── config/             # Database connection (db.js)
    ├── controllers/        # API business logic
    ├── middleware/         # Auth, Error handling, Uploads
    ├── models/             # Database models (User, Property, Admin, Owner)
    ├── routes/             # Express API routes
    └── server.js           # Main Express application entry point
