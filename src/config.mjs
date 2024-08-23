import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  DEEPL_API_KEY: z.string().min(1, 'DEEPL_API_KEY is required')
});

// Parse and validate the environment variables
const env = envSchema.parse(process.env);

export const DEEPL_API_KEY = env.DEEPL_API_KEY;
