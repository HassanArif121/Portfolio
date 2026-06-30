import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const port = Number(process.env.PORT || 4000);
const memoryMessages = [];

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/assets", express.static(path.join(rootDir, "public", "assets")));

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    source: { type: String, default: "portfolio" }
  },
  { timestamps: true }
);

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", contactSchema);

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Contact messages will be kept in memory for this run.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to in-memory messages.");
    console.warn(error.message);
    return false;
  }
}

let mongoReady = false;

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoReady && mongoose.connection.readyState === 1 ? "connected" : "memory"
  });
});

app.get("/api/profile", (_req, res) => {
  res.json({
    name: "Muhammad Hassan",
    role: "AI/ML + Full Stack Developer",
    location: "Lahore, Pakistan",
    email: "hassan7663arif@gmail.com",
    phone: "+92-370-7885899"
  });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Name, email, and message are required."
    });
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || "Portfolio inquiry",
    message: message.trim(),
    source: "muhammad-hassan-portfolio"
  };

  try {
    if (mongoReady && mongoose.connection.readyState === 1) {
      const saved = await ContactMessage.create(payload);
      return res.status(201).json({ ok: true, id: saved._id });
    }

    const localId = `local-${Date.now()}`;
    memoryMessages.push({ id: localId, ...payload, createdAt: new Date().toISOString() });
    return res.status(201).json({ ok: true, id: localId, storage: "memory" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: "Could not save the message." });
  }
});

const distDir = path.join(rootDir, "dist");
app.use(express.static(distDir));
app.use((_req, res) => {
  res.sendFile(path.join(distDir, "index.html"), (error) => {
    if (error) {
      res.status(404).send("Run npm run dev for the local development site.");
    }
  });
});

mongoReady = await connectMongo();

app.listen(port, () => {
  console.log(`Portfolio API running on http://127.0.0.1:${port}`);
});
