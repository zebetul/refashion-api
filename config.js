import { S3Client } from "@aws-sdk/client-s3";
import knex from "knex";

export const PORT = process.env.PORT || 8000;

// Allowed origins for CORS configuration
export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://restil.onrender.com",
  "https://restil.ro",
  "https://www.restil.ro",
];

// Database configuration
export const dataBase = knex({
  client: "pg",
  connection: {
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASSWORD,
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    database: process.env.PSQL_DATABASE,
  },
});

// AWS S3 configuration
export const REGION = "eu-north-1";
export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
