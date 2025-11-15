# React + Vite

📘 Smart Recipe Generator — Frontend (React)

AI-powered recipe suggestion UI based on ingredients, dietary preferences, and smart matching.

🚀 Overview

This is the frontend-only part of the Smart Recipe Generator project.

The application allows users to:

Enter ingredients manually

Upload ingredient photos

Detect ingredients using AI (via backend API)

Get recipe suggestions with match score

View full recipe details (steps, nutrition, time, difficulty)

Save recipes locally

Apply filters (difficulty, cook time, diet)

Browse saved recipes

The frontend is fully responsive, modern, and built using React + Vite.

⚠️ Note:
This frontend connects to a backend (API). The backend must run separately.

🎯 Frontend Features
🔍 Ingredient Input

Text input mode

Photo upload mode

Automatic ingredient detection

Popular ingredient suggestions

Dietary options (veg, vegan, gluten-free)

🍳 Recipe Results

Displays match score (%)

Recipe cards with metadata

Quick view of ingredients

Sort by:

Match score

Time

Difficulty

📘 Recipe Detail Page

Full instructions

Nutrition info

Image

Save recipe

Share recipe

❤️ Saved Recipes

Saved locally using LocalStorage

View saved recipes anytime

Remove saved recipes

Suggested recipes based on saved items

🏗️ Folder Structure
frontend/
├── src/
│   ├── api/
│   │   └── api.js               # Backend API calls
│   │
│   ├── components/
│   │   ├── ImageUploader.jsx
│   │   ├── RecipeCard.jsx
│   │   └── NutritionCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── IngredientInput.jsx
│   │   ├── RecipeResults.jsx
│   │   ├── RecipeDetail.jsx
│   │   └── SavedRecipes.jsx
│   │
│   ├── styles/
│   │   ├── colors.css
│   │   └── layout.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md

🎨 UI Design Highlights

Clean, modern layout

Mobile-responsive

Hero section

Smooth transitions

Card-based recipe layout

AI image detection UI

🧩 Tech Stack
🔹 Framework

React 18

Vite

🔹 Libraries

Axios

Lucide-react icons

CSS custom properties (for theme colors)

⚙️ Installation (Frontend Only)
1️⃣ Install dependencies
npm install

2️⃣ Start frontend
npm run dev

Default URL:
http://localhost:5173

🔌 Connecting to Backend

Edit:

src/api/api.js
export const API_BASE = "http://localhost:5000/api";


This connects all frontend pages to backend endpoints:

Purpose	Endpoint
Ingredient detection	/image/recognize
Search recipes	/recipes/search
Get recipe details	/recipes/:id
Save recipe	/user/save
Get saved recipes	/user/saved
🌐 Deployment (Frontend Only)
Deploy to:
✔ Netlify

OR

✔ Vercel
Vite build command:
npm run build


Build output:

/dist


Upload /dist to Netlify or deploy with Vercel CLI.

🧪 Testing (Frontend)

Check ingredient input

Test image upload → ingredient detection

Verify recipe results populate

Open recipe detail

Save recipe

Check saved recipes page

Test responsiveness (mobile view
