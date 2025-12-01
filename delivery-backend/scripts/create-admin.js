// Simple admin creation script.
// Usage: from project root
//  cd delivery-backend
//  node scripts/create-admin.js --email=admin@example.com --password=securepass --name=Admin

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function loadUserModel() {
  try {
    // try compiled JS first
    const mod = require("../dist/models/User");
    return mod.default || mod;
  } catch (e) {
    // fallback to TS sources (requires ts-node if TypeScript-only runtime)
    try {
      return require("../src/models/User");
    } catch (err) {
      console.error("Could not load User model from dist or src:", err);
      process.exit(1);
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  args.forEach((a) => {
    const m = a.match(/^--([a-zA-Z0-9_-]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  });
  return out;
}

async function run() {
  const cfg = parseArgs();
  const email = cfg.email || "admin@example.com";
  const password = cfg.password || "ChangeMe123!";
  const name = cfg.name || "Administrator";

  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI not set in environment. Copy .env.example -> .env and set it."
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const User = await loadUserModel();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("User with that email already exists:", existing._id);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash, role: "admin" });
  await user.save();
  console.log("Created admin user id=", user._id.toString());
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
