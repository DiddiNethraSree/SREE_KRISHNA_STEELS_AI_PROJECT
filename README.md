# SKS Furniture Showroom Website

A full-stack starter project for your furniture business:
- Product catalogue with category filter and search
- WhatsApp inquiry button for every product
- Google Maps location section
- Customer review section
- Admin form to add products

## Tech Stack

- Frontend: Vite + TypeScript + HTML/CSS
- Backend: Node.js + Express
- Data store: JSON file (`backend/src/data/products.json`)

## Setup

1. Install dependencies:
   - `npm install` (root)
   - `npm install --prefix frontend`
   - `npm install --prefix backend`
2. Create env files:
   - Copy `frontend/.env.example` to `frontend/.env`
   - Copy `backend/.env.example` to `backend/.env`
3. Update values:
   - `VITE_WHATSAPP_NUMBER` with your shop WhatsApp number
   - `ADMIN_KEY` with a secure secret key

## Run

Open two terminals from project root:

- Terminal 1: `npm run dev --prefix backend`
- Terminal 2: `npm run dev --prefix frontend`

Then open:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Build Frontend

- `npm run build --prefix frontend`

## Add Real Shop Photos

You can:
1. Upload photos to Cloudinary/Google Drive direct links and paste into admin form, or
2. Add direct image URLs in `backend/src/data/products.json`

If you share your real product photos, we can replace all demo products with your real showroom catalogue next.
