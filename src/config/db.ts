import { env } from "./env.js";
import { PrismaClient } from '../../generated/prisma/client.js'; // Import from your custom output
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = env.DATABASE_URL;

// 1. Create the native driver pool
const pool = new pg.Pool({ connectionString });

// 2. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Client
const prisma = new PrismaClient({ adapter });

export default prisma;