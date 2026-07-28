import { PrismaClient } from './src/generated/prisma/index.js';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const libsql = createClient({
  url: 'file:./dev.db',
});

const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ 
  adapter,
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

async function main() {
  const jobs = await prisma.job.findMany();
  console.log('Success!', jobs);
}
main().catch(console.error);
