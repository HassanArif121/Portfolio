import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const port = Number(process.env.PORT || 4000);
const memoryMessages = [];
const inboxEmail = process.env.CONTACT_TO_EMAIL || "hassan7663arif@gmail.com";
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_APP_PASSWORD;
const parsedEmailTimeoutMs = Number.parseInt(process.env.EMAIL_TIMEOUT_MS || "15000", 10);
const emailTimeoutMs = Number.isFinite(parsedEmailTimeoutMs) && parsedEmailTimeoutMs > 0
  ? parsedEmailTimeoutMs
  : 15000;

// Restrict the API to your static-site origin(s) when ALLOWED_ORIGINS is set
// (comma-separated). Left unset, it allows all origins.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors(
    allowedOrigins.length
      ? { origin: allowedOrigins }
      : undefined
  )
);
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

function createMailTransport() {
  if (!emailUser || !emailPassword) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    connectionTimeout: emailTimeoutMs,
    greetingTimeout: emailTimeoutMs,
    socketTimeout: emailTimeoutMs,
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendContactEmail(payload) {
  const transporter = createMailTransport();

  if (!transporter) {
    throw new Error("Email service is not configured.");
  }

  const subject = `Portfolio contact: ${payload.subject}`;
  const text = [
    "New portfolio contact message",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    "",
    payload.message
  ].join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2>New portfolio contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;padding:14px;border:1px solid #ddd;border-radius:8px;background:#f7f7f7">${escapeHtml(payload.message)}</div>
    </div>
  `;

  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Email service timed out."));
    }, emailTimeoutMs);
  });

  try {
    return await Promise.race([
      transporter.sendMail({
        from: `"Muhammad Hassan Portfolio" <${emailUser}>`,
        to: inboxEmail,
        replyTo: payload.email,
        subject,
        text,
        html
      }),
      timeout
    ]);
  } finally {
    clearTimeout(timeoutId);
    transporter.close();
  }
}

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
let smtpStatus = emailUser && emailPassword ? "unverified" : "missing";

// Confirm the Gmail credentials actually authenticate, and log the real reason
// if they don't. This runs once at startup so /api/health can report it.
async function verifySmtp() {
  const transporter = createMailTransport();
  if (!transporter) {
    smtpStatus = "missing";
    console.warn("Email is NOT configured: set EMAIL_USER and EMAIL_APP_PASSWORD.");
    return;
  }
  try {
    await transporter.verify();
    smtpStatus = "ok";
    console.log(`SMTP verified. Contact emails will be sent to ${inboxEmail}.`);
  } catch (error) {
    smtpStatus = `error: ${error.message}`;
    console.error("SMTP verification FAILED. The contact form cannot send email.");
    console.error("Reason:", error.message);
    console.error(
      "Most common fix: use a Gmail *App Password* (16 chars, 2-Step Verification must be ON), not your normal password."
    );
  } finally {
    transporter.close();
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoReady && mongoose.connection.readyState === 1 ? "connected" : "memory",
    email: emailUser && emailPassword ? "configured" : "missing",
    smtp: smtpStatus,
    inbox: inboxEmail,
    allowedOrigins: allowedOrigins.length ? allowedOrigins : "all"
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
    let id;

    if (mongoReady && mongoose.connection.readyState === 1) {
      const saved = await ContactMessage.create(payload);
      id = saved._id;
    } else {
      const localId = `local-${Date.now()}`;
      memoryMessages.push({ id: localId, ...payload, createdAt: new Date().toISOString() });
      id = localId;
    }

    await sendContactEmail(payload);
    return res.status(201).json({ ok: true, id, email: "sent" });
  } catch (error) {
    console.error("Contact submission failed.");
    console.error("Message:", error.message);
    if (error.code) console.error("Code:", error.code);
    if (error.response) console.error("SMTP response:", error.response);

    const notConfigured = /not configured/i.test(error.message);
    return res.status(notConfigured ? 503 : 500).json({
      ok: false,
      error: notConfigured
        ? "Email is not set up yet. Please email me directly at " + inboxEmail + "."
        : "Could not send the message right now. Please email me directly at " + inboxEmail + "."
    });
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
await verifySmtp();

app.listen(port, () => {
  console.log(`Portfolio API running on http://127.0.0.1:${port}`);
});
