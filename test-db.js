
const { PrismaClient } = require("./node_modules/.prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to Supabase!");
  } catch (e) {
    console.error("Connection failed:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
