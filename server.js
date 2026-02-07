import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- FOOD GET APIs ---------------- */

// 1️⃣ Get All Foods
app.get("/food", (req, res) => {
  res.json([
    { id: 1, name: "Pizza", category: "Fast Food", price: 299 },
    { id: 2, name: "Burger", category: "Fast Food", price: 199 },
    { id: 3, name: "Biryani", category: "Indian", price: 249 },
    { id: 4, name: "Pasta", category: "Italian", price: 279 },
    { id: 5, name: "Dosa", category: "South Indian", price: 149 },
  ]);
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to My Express API 🚀",
    app: "Testing Backend Railway App",
    version: "1.0.0"
  });
});
// 2️⃣ Get All Restaurants
app.get("/api/restaurants", (req, res) => {
  res.json([
    { id: 1, name: "Spicy Hub", location: "Hyderabad", rating: 4.5 },
    { id: 2, name: "Food Palace", location: "Chennai", rating: 4.2 },
    { id: 3, name: "Taste Town", location: "Delhi", rating: 4.6 },
    { id: 4, name: "Urban Bites", location: "Mumbai", rating: 4.3 },
    { id: 5, name: "Royal Dine", location: "Bangalore", rating: 4.4 },
  ]);
});


/* ---------------- TRAVEL GET APIs ---------------- */

// 3️⃣ Get All Travel Places
app.get("/api/travels", (req, res) => {
  res.json([
    { id: 1, place: "Goa", country: "India", budget: 15000 },
    { id: 2, place: "Paris", country: "France", budget: 120000 },
    { id: 3, place: "Bali", country: "Indonesia", budget: 80000 },
    { id: 4, place: "Dubai", country: "UAE", budget: 90000 },
    { id: 5, place: "Manali", country: "India", budget: 20000 },
  ]);
});

// 4️⃣ Get All Hotels
app.get("/api/hotels", (req, res) => {
  res.json([
    { id: 1, name: "Sea View Resort", city: "Goa", pricePerNight: 5000 },
    { id: 2, name: "Mountain Stay", city: "Manali", pricePerNight: 3500 },
    { id: 3, name: "City Palace Hotel", city: "Delhi", pricePerNight: 4000 },
    { id: 4, name: "Royal Suites", city: "Dubai", pricePerNight: 15000 },
    { id: 5, name: "Paris Inn", city: "Paris", pricePerNight: 12000 },
  ]);
});

// 5️⃣ Get All Flights
app.get("/api/flights", (req, res) => {
  res.json([
    { id: 1, from: "Delhi", to: "Goa", price: 4500 },
    { id: 2, from: "Mumbai", to: "Dubai", price: 18000 },
    { id: 3, from: "Chennai", to: "Bali", price: 35000 },
    { id: 4, from: "Delhi", to: "Paris", price: 55000 },
    { id: 5, from: "Bangalore", to: "Manali", price: 6000 },
  ]);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
