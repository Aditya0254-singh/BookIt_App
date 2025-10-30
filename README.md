# 🌍 BookIt – Experience Booking Platform  

A **full-stack web application** for booking travel experiences with **real-time slot availability**, **promo code discounts**, and **instant confirmation** — built for the **Fullstack Intern Assignment**.

---

## 🚀 Live Demo  

🔗 **Frontend:** [bookit-frontend-gules.vercel.app](https://bookit-frontend-gules.vercel.app)  
🔗 **Backend API:** [bookit-backend-puoc.onrender.com/api](https://bookit-backend-puoc.onrender.com/api)  
💻 **GitHub Repository:** [github.com/Aditya0254-singh/BookIt_App](https://github.com/Aditya0254-singh/BookIt_App)

---

## 📸 Screenshots  

| Home Page | Details Page | Checkout Page | Confirmation Page |
|------------|---------------|----------------|--------------------|
| ![Home](./screenshots/homepage.png) | ![Details](./screenshots/details.png) | ![Checkout](./screenshots/checkout.png) | ![Confirmation](./screenshots/result.png) |

> Place screenshots in a folder named `screenshots/` at your repo root.

---

## 🧭 Table of Contents  

1. [Overview](#-overview)  
2. [Features](#-features)  
3. [Tech Stack](#-tech-stack)  
4. [API Endpoints](#-api-endpoints)  
5. [Setup Instructions](#-local-development-setup)  
6. [Database Schema](#-database-schema)  
7. [Design & Security](#-design--security)  
8. [Deployment](#-deployment)  
9. [Developer](#-developer)  

---

## 📝 Overview  

**BookIt** allows users to explore curated travel experiences, check **live availability**, apply **promo codes**, and receive **instant booking confirmations**.  
Built with a **TypeScript + React frontend** and a **Node.js + Express backend**, it ensures smooth and reliable booking operations.

---

## ✨ Features  

✅ Browse experiences with ratings and images  
✅ Detailed experience info with available time slots  
✅ Real-time slot availability (Prisma + PostgreSQL)  
✅ Booking form with input/email validation  
✅ Promo code validation and discount calculation  
✅ Prevents double-booking with DB transactions  
✅ Booking confirmation page with unique ID  
✅ Mobile-friendly responsive layout  
✅ Proper error handling & loading states  

---

## 🧑‍💻 Tech Stack  

### 🖥️ **Frontend**
- ⚛️ React 18 + TypeScript  
- ⚡ Vite  
- 🎨 TailwindCSS  
- 🔗 React Router DOM  
- 📦 Axios  
- 🧩 Lucide React Icons  

### 🧠 **Backend**
- 🟩 Node.js + Express  
- 🧰 TypeScript  
- 🗄️ Prisma ORM  
- 🐘 PostgreSQL (via Supabase)  
- 🔒 CORS enabled  

### ☁️ **Deployment**
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** Supabase (PostgreSQL)  

---

## 🔌 API Endpoints  

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/experiences` | Fetch all experiences |
| GET | `/api/experiences/:id` | Fetch single experience |
| GET | `/api/experiences/:id/slots` | Fetch available time slots |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/:bookingId` | Get booking details |
| POST | `/api/promo/validate` | Validate promo code |

---

## 🧪 Test Booking Flow  

### 💡 Available Promo Codes  
| Code | Discount |
|------|-----------|
| `SAVE10` | $10 off |
| `FLAT100` | $100 off |
| `WELCOME20` | $20 off |

### 🎯 Try It Out
1. Visit the [live frontend](https://bookit-frontend-gules.vercel.app)
2. Browse experiences (8 available)
3. Click **Sunset Desert Safari**
4. Choose any available slot  
5. Fill in your details  
6. Apply promo code `SAVE10`  
7. Confirm booking → see instant confirmation 🎉  

---

## ⚙️ Local Development Setup  

### 🧩 Prerequisites
- Node.js v18+
- npm or yarn
- PostgreSQL or Supabase account

---

### 🖥️ Frontend Setup
```cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

#.env.local
`VITE_API_URL=http://localhost:3000/api`

---

### ⚙️ Backend Setup

```cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
# Runs on http://localhost:3000
```
# .env
```
DATABASE_URL="your_postgresql_connection_string"
PORT=3000
NODE_ENV=development
```
# 🗂️ Project Structure

```
BookIt_App/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── DetailsPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── ResultPage.tsx
│   │   ├── services/api.ts
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── experienceController.ts
    │   │   ├── bookingController.ts
    │   │   └── promoController.ts
    │   ├── routes/
    │   │   ├── experiences.ts
    │   │   ├── bookings.ts
    │   │   └── promo.ts
    │   ├── middleware/errorHandler.ts
    │   ├── utils/validator.ts
    │   ├── server.ts
    │   └── seed.ts
    ├── prisma/schema.prisma
    └── package.json
```
---

### 🎨 Design & Security

# 💅 Design Principles

- Clean, intuitive, and modern layout

- Blue primary color (#2563eb)

- Smooth transitions & loading skeletons

- Mobile-first responsive design

- Accessible UI with proper semantics

---

# 🔒 Security Measures

- Input validation (frontend + backend)

- SQL injection prevention via Prisma ORM

- Secure CORS configuration

- Environment-based secrets

- Transaction-safe booking logic

---

### 🧭 Database Schema

- Experiences → stores travel experiences

- Slots → manages availability

- Bookings → stores confirmed bookings

- PromoCodes → stores and validates discounts

All managed via Prisma ORM on Supabase PostgreSQL.

---

### ☁️ Deployment

Service	Platform	Description
Frontend	Vercel	Auto deploys on git push
Backend	Render	Auto deploys with environment vars
Database	Supabase	Managed PostgreSQL with backups

---

👨‍💻 Developer

Name: Aditya Singh
Email: [Your Email]
GitHub: Aditya0254-singh

---

### 📄 License

MIT License – Feel free to use this project for learning and inspiration.

---

🧡 Built with passion for the Fullstack Intern Challenge.

---
