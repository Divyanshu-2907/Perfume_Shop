const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// ✅ Routes
app.use("/api/products", require("./routes/productRoutes"));

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("🚀 Perfume Shop API is running...");
});

// ✅ Global Error Handler (for better debugging)
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
