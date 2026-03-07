const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const Program = require("./models/Program");
const Lab = require("./models/Lab");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("RGITX Backend API is running...");
});

// API Routes
app.post("/api/programs", async (req, res) => {
    console.log("📥 POST /api/programs received:", req.body);
    try {
        const { number, title, code, labType } = req.body;
        if (!number || !title || !code || !labType) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newProgram = new Program({ number, title, code, labType });
        await newProgram.save();
        console.log("✅ Program saved:", newProgram._id);
        res.status(201).json(newProgram);
    } catch (err) {
        console.error("❌ Save error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Search endpoint
app.get("/api/programs/search", async (req, res) => {
    const { q } = req.query;
    console.log(`🔍 Search request received: "${q}"`);
    try {
        if (!q) return res.json([]);

        const programs = await Program.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { number: { $regex: q, $options: "i" } }
            ]
        }).limit(20);

        res.json(programs);
    } catch (err) {
        console.error("❌ Search error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/programs/:labType", async (req, res) => {
    console.log(`🔍 GET /api/programs/${req.params.labType} received`);
    try {
        const { labType } = req.params;
        // Numeric sorting for the 'number' field (e.g., 1, 2, 10 instead of 1, 10, 2)
        const programs = await Program.find({ labType })
            .collation({ locale: "en", numericOrdering: true })
            .sort({ number: 1 });
        res.json(programs);
    } catch (err) {
        console.error("❌ Fetch error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/programs/:id", async (req, res) => {
    console.log(`🗑️ DELETE /api/programs/${req.params.id} received`);
    try {
        const { id } = req.params;
        const deletedProgram = await Program.findByIdAndDelete(id);
        if (!deletedProgram) {
            return res.status(404).json({ error: "Program not found" });
        }
        console.log("✅ Program deleted:", id);
        res.json({ message: "Program deleted successfully" });
    } catch (err) {
        console.error("❌ Delete error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Lab endpoints
app.get("/api/labs", async (req, res) => {
    try {
        const labs = await Lab.find().sort({ createdAt: 1 });
        res.json(labs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/labs", async (req, res) => {
    try {
        const { name, type, date } = req.body;
        const newLab = new Lab({ name, type, date });
        await newLab.save();
        res.status(201).json(newLab);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/labs/:id", async (req, res) => {
    try {
        await Lab.findByIdAndDelete(req.params.id);
        res.json({ message: "Lab deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Login (Securely on Backend)
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;

    if (email === adminEmail && password === adminPass) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Bhai kya kar rha hai? ✗" });
    }
});

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log("✅ Connected to MongoDB");
        // Seed initial labs if collection is empty
        const count = await Lab.countDocuments();
        if (count === 0) {
            console.log("🌱 Seeding initial labs...");
            await Lab.insertMany([
                { name: "WEB LAB", type: "weblab", date: "March 05, 2025" },
                { name: "Machine Learning", type: "ml", date: "March 06, 2025" }
            ]);
            console.log("✅ Seeding complete");
        }
    })
    .catch((err) => {
        console.error("MongoDB Error:", err);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
