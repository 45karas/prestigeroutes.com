import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@prestigeroutes.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "PrestigeAdmin2026!";
  const name = process.env.ADMIN_NAME || "Prestige Admin";

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role: "ADMIN",
    },
    create: {
      email,
      passwordHash,
      name,
      role: "ADMIN",
    },
  });

  console.log(`Admin account ready: ${admin.email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
