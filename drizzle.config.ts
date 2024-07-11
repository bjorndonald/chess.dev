import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "postgresql", 
    schema: "./src/database/schema.ts",
    out: "./src/drizzle",
    dbCredentials: {
        url: `${process.env.AUTH_DRIZZLE_URL}${process.env.NODE_ENV === "production" ? ";sslmode=verify-ca;sslrootcert=ca.pem": ""}`,
    },
});
