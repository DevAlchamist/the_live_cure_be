const mongoose = require("mongoose");
const { User } = require("../models/Users.modal");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI);
    
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@thelivecure.com" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Name:", existingAdmin.name);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@thelivecure.com",
      password: "Admin@123456", // Will be hashed automatically by the pre-save hook
      role: "Admin",
    });

    console.log("\n🎉 Admin user created successfully!");
    console.log("=========================================");
    console.log("Email:", adminUser.email);
    console.log("Password: Admin@123456");
    console.log("Role:", adminUser.role);
    console.log("=========================================");
    console.log("\n📝 Use these credentials to login via POST /api/auth/login");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdminUser();

