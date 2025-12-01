import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";
import bcrypt from "bcryptjs";

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create test users
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        name: "Seller One",
        email: "seller@example.com",
        password: await bcrypt.hash("seller123", 10),
        role: "seller",
      },
      {
        name: "Seller Two",
        email: "seller2@example.com",
        password: hashedPassword,
        role: "seller",
      },
      {
        name: "Buyer One",
        email: "buyer@example.com",
        password: await bcrypt.hash("buyer123", 10),
        role: "buyer",
      },
      {
        name: "Buyer Two",
        email: "buyer2@example.com",
        password: hashedPassword,
        role: "buyer",
      },
      {
        name: "Buyer Three",
        email: "buyer3@example.com",
        password: hashedPassword,
        role: "buyer",
      },
    ];

    await User.insertMany(users);
    console.log("✅ Seeded users successfully!");
    console.log("\nTest Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:  admin@example.com   / admin123");
    console.log("Seller: seller@example.com  / seller123");
    console.log("Seller: seller2@example.com / password123");
    console.log("Buyer:  buyer@example.com   / buyer123");
    console.log("Buyer:  buyer2@example.com  / password123");
    console.log("Buyer:  buyer3@example.com  / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedUsers();
