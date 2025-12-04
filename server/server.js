import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==================== CONNECT TO MONGODB ==================== //
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ==================== VALIDATION TABLE (COLLECTION) ==================== //
const validationSchema = new mongoose.Schema(
  {
    name: String,                                // optional
    email: { type: String, required: true },      // required
    school: String,                               // optional
    createdAt: { type: Date, default: Date.now }  // auto time
  },
  { collection: "validation" }                    // 👈 使用你创建的 collection
);

const Validation = mongoose.model("Validation", validationSchema);

// ==================== SAVE FORM DATA ==================== //
app.post("/api/validation", async (req, res) => {
  try {
    const { name, email, school } = req.body;

    if (!email) {
      return res.status(400).json({ ok: false, message: "Email is required" });
    }

    const newRecord = await Validation.create({ name, email, school });
    return res.status(201).json({ ok: true, data: newRecord });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ==================== GET HOW MANY RECORDS ==================== //
app.get("/api/validation/count", async (req, res) => {
  try {
    const count = await Validation.countDocuments();
    res.json({ ok: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ==================== START SERVER ==================== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
