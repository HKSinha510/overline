import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  private static resolveDatabaseUrl(): string {
    const directUrl =
      process.env.DATABASE_URL ||
      process.env.DATABASE_PRIVATE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRESQL_URL ||
      process.env.PG_URL;

    if (directUrl) {
      return directUrl;
    }

    const host = process.env.PGHOST;
    const port = process.env.PGPORT || '5432';
    const user = process.env.PGUSER;
    const password = process.env.PGPASSWORD;
    const database = process.env.PGDATABASE;

    if (host && user && password && database) {
      const encodedUser = encodeURIComponent(user);
      const encodedPassword = encodeURIComponent(password);
      const encodedDatabase = encodeURIComponent(database);
      return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${encodedDatabase}?schema=public`;
    }

    const available = [
      'DATABASE_URL',
      'DATABASE_PRIVATE_URL',
      'POSTGRES_URL',
      'POSTGRESQL_URL',
      'PG_URL',
      'PGHOST',
      'PGPORT',
      'PGUSER',
      'PGPASSWORD',
      'PGDATABASE',
    ]
      .filter((key) => !!process.env[key])
      .join(', ');

    throw new Error(
      `Database connection string is missing. Set DATABASE_URL (preferred) or PG* variables. Available DB-related vars: ${available || 'none'}`,
    );
  }

  constructor() {
    const databaseUrl = PrismaService.resolveDatabaseUrl();

    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    const redactedUrl = databaseUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
    this.logger.log(`Prisma datasource configured: ${redactedUrl}`);
  }

  async onModuleInit() {
    let retries = 3;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('📦 Database connected');
        return;
      } catch (error) {
        retries--;
        this.logger.warn(`Database connection failed, ${retries} retries left`);
        if (retries === 0) throw error;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper for transactions
  async executeTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(async (prisma) => {
      return fn(prisma as PrismaClient);
    });
  }

  // Clean database for testing
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase can only be used in test environment');
    }

    const tablenames = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
        } catch (error) {
          console.log({ error });
        }
      }
    }
  }
}
