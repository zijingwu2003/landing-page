import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1) 连接 MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// 2) 定义 schema（存 email + 时间）
const WaitlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const Waitlist = mongoose.model("Waitlist", WaitlistSchema);

// 3) 提交报名：存邮箱 + 返回总人数
app.post("/api/waitlist", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ ok: false, message: "Invalid email" });
  }

  // upsert：避免重复 email 反复报名
  await Waitlist.updateOne(
    { email },
    { $setOnInsert: { email, createdAt: new Date() } },
    { upsert: true }
  );

  const count = await Waitlist.countDocuments();
  res.json({ ok: true, count });
});

// 4) 获取真实报名人数
app.get("/api/waitlist/count", async (req, res) => {
  const count = await Waitlist.countDocuments();
  res.json({ ok: true, count });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
