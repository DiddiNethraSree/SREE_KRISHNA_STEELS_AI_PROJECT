# FurniVision AI: Intelligent Showroom & Spatial Analysis Platform

**FurniVision AI** (formerly SKS Furniture Showroom) is a modern, full-stack e-commerce and augmented spatial analysis platform built for the furniture industry. It bridges the gap between physical showrooms and digital experiences by providing users with AI-driven room measurement, AR visual previews, and an intelligent recommendation engine.

## 🌟 Key Features

### 🤖 AI Designer & Measurement Suite
- **AI Room Dimension Analyser:** Users can upload a photo of an empty room, and the system heuristically estimates width, length, and height, dynamically drawing scaled dimension overlays directly onto the canvas. It computes total square footage and recommends optimal sofa sizing.
- **AR Camera Room Preview:** Allows customers to digitally position 2D furniture overlays onto their room photos with intuitive scaling, rotating, and X/Y positioning controls to visualize exact placements.
- **Smart Recommendation Engine:** A dynamic form-based AI that processes room dimensions, budget constraints, furniture categories, and styling preferences to generate custom, personalized product recommendations.

### 🛍️ Dynamic E-Commerce & Showroom
- **Premium Royal Theme UI:** Designed with a luxurious Glassmorphism aesthetic, featuring dynamic CSS animations, staggered cascade loads, and responsive light-cream/royal-blue contrast components.
- **Real-time Catalogue Management:** Full search and filtering capabilities.
- **Direct WhatsApp Integration:** 1-click inquiries seamlessly pass product information and AI dimension calculations directly into a WhatsApp chat with the proprietor.

### ⚙️ Admin Studio
- **Secure Dashboard:** Protected via `ADMIN_KEY` authentication for inventory control.
- **Full CRUD Operations:** Add, update, and delete showroom products natively interacting with the REST API.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, TypeScript, Vite
- **Backend:** Node.js, Express.js, REST API
- **Data Store:** JSON Database Architecture (`backend/src/data/products.json`)

## 🚀 Local Setup

1. **Install dependencies:**
   - `npm install` (root)
   - `npm install --prefix frontend`
   - `npm install --prefix backend`
2. **Environment Configuration:**
   - Copy `frontend/.env.example` to `frontend/.env` (Set `VITE_WHATSAPP_NUMBER` and `VITE_API_URL`)
   - Copy `backend/.env.example` to `backend/.env` (Set `ADMIN_KEY`)
3. **Run Development Servers:**
   - Terminal 1: `npm run dev --prefix backend` (Runs on port 4000)
   - Terminal 2: `npm run dev --prefix frontend` (Runs on port 5173)

## 💡 Origin Story
This platform was built to modernize **Sree Krishna Steels & Furniture**, operated by Diddi Krishna. The AI Dimension Analyser specifically solves the business bottleneck of manually visiting customer homes for exact measurements, instead allowing customers to use their phone cameras to extract spatial data.
