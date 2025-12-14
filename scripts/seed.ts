import { db } from "../src/db/db";
import { users, disabledDates } from "../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { format } from "date-fns";
import "dotenv/config";

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

async function seed() {
  try {
    console.log("Starting seed...");

    // Create admin user (if not exists)
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, "admin"))
      .limit(1);

    if (existingAdmin.length === 0) {
      const adminPasswordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        BCRYPT_ROUNDS,
      );

      await db.insert(users).values({
        name: "Admin",
        idNumber: "0000000000",
        phoneNumber: "admin",
        passwordHash: adminPasswordHash,
      });

      console.log("✓ Admin user created");
    } else {
      console.log("✓ Admin user already exists");
    }

    // Create sample disabled date range
    const existingDisabled = await db
      .select()
      .from(disabledDates)
      .limit(1);

    if (existingDisabled.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      await db.insert(disabledDates).values({
        startDate: format(tomorrow, "yyyy-MM-dd"),
        endDate: format(dayAfterTomorrow, "yyyy-MM-dd"),
        reason: "تعطیلات نمونه",
        createdBy: "admin",
      });

      console.log("✓ Sample disabled date range created");
    } else {
      console.log("✓ Disabled dates already exist");
    }

    // Create test user (optional, for development)
    if (process.env.CREATE_TEST_USER === "true") {
      const existingTestUser = await db
        .select()
        .from(users)
        .where(eq(users.phoneNumber, "09123456789"))
        .limit(1);

      if (existingTestUser.length === 0) {
        const testPasswordHash = await bcrypt.hash("test123", BCRYPT_ROUNDS);

        await db.insert(users).values({
          name: "کاربر تست",
          idNumber: "1234567890",
          phoneNumber: "09123456789",
          passwordHash: testPasswordHash,
        });

        console.log("✓ Test user created (phone: 09123456789, password: test123)");
      } else {
        console.log("✓ Test user already exists");
      }
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

// Run seed
seed()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

