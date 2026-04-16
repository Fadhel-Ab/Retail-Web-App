// prisma.config.ts
import "dotenv/config"; // Required to load variables from .env
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // env() is the preferred way to access variables in Prisma 7
    url: env("DATABASE_URL"),
  },
});
