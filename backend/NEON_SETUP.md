# Neon PostgreSQL Setup Guide

## Overview
This project is configured to use **Neon PostgreSQL** as the database provider. Neon is a serverless PostgreSQL platform with automatic scaling and branching capabilities.

## Quick Setup

### 1. Get Your Neon Database URL

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (or use existing)
3. Copy your connection string from the dashboard
4. It should look like: `postgresql://user:password@ep-xxx-xxx.neon.tech/dbname?sslmode=require`

### 2. Configure Environment Variables

Update your `.env` file:

```bash
# Replace with your actual Neon connection string
DATABASE_URL="postgresql://your_user:your_password@ep-xxx-xxx.neon.tech/your_db?sslmode=require"
```

**Important Notes:**
- Always include `?sslmode=require` at the end of the URL
- Keep quotes around the DATABASE_URL value
- Never commit `.env` file to version control
- Use `.env.example` as a template

### 3. Install Dependencies

Make sure you have the PostgreSQL driver installed:

```bash
npm install
```

The `pg` package is already included in `package.json`.

### 4. Start the Application

```bash
npm run start:dev
```

### 5. Verify Database Connection

Test the connection by visiting:

```
http://localhost:3000/health
```

You should see a response like:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-24T...",
  "database_type": "postgres",
  "database_version": "PostgreSQL 16.x..."
}
```

## Database Features

### TypeORM Configuration

The project uses TypeORM with the following settings:

- **Development**: `synchronize: true` (auto-creates tables)
- **Production**: `synchronize: false` (requires migrations)
- **SSL**: Enabled by default for Neon
- **Connection Pool**: Max 10 connections
- **Logging**: Enabled in development only

### Fallback to SQLite

If `DATABASE_URL` is not set, the application will fallback to SQLite for local development:

```typescript
// No DATABASE_URL → SQLite
database: 'electricity_billing.db'
```

## Production Deployment (Railway/Heroku/Vercel)

### Environment Variables

Set these in your production environment:

```bash
DATABASE_URL="your_neon_postgresql_url?sslmode=require"
NODE_ENV="production"
JWT_SECRET="strong_random_secret"
PORT=3000
ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

### Database Migrations

For production, you should use migrations instead of `synchronize: true`:

1. Generate migration:
```bash
npm run typeorm migration:generate -- -n InitialSchema
```

2. Run migrations:
```bash
npm run typeorm migration:run
```

### SSL Configuration

Neon PostgreSQL requires SSL. The configuration is already set:

```typescript
ssl: {
  rejectUnauthorized: false, // Required for Neon
}
```

## Troubleshooting

### Connection Timeout

If you see connection timeouts:

1. Check your Neon project is active
2. Verify the connection string is correct
3. Ensure `?sslmode=require` is included
4. Check your firewall settings

### SSL Errors

If SSL handshake fails:

```typescript
// Already configured in database.module.ts
ssl: {
  rejectUnauthorized: false,
}
```

### IPv6 Issues

Neon uses IPv6 by default. If you have IPv6 connectivity issues, use the pooled connection string from Neon dashboard.

## Health Check Endpoints

### Full Health Check
```
GET http://localhost:3000/health
```

Returns database version, connection status, and timestamp.

### Simple Ping
```
GET http://localhost:3000/health/db
```

Returns just connection status (faster).

## Database Schema

The application will automatically create tables from entities in development mode. Entities are located in:

```
src/auth/entities/*.entity.ts
src/calculation/entities/*.entity.ts
src/config/entities/*.entity.ts
```

## Migration from SQLite

If you're migrating from SQLite:

1. Export your SQLite data
2. Set up Neon PostgreSQL (this guide)
3. Import data to PostgreSQL
4. Update `DATABASE_URL` in `.env`
5. Restart application

The TypeORM entities are compatible with both SQLite and PostgreSQL.

## Security Best Practices

✅ **DO:**
- Use environment variables for sensitive data
- Include `?sslmode=require` in connection string
- Use strong JWT secrets
- Set `NODE_ENV=production` in production
- Enable CORS only for trusted domains

❌ **DON'T:**
- Commit `.env` file to git
- Use default/weak passwords
- Disable SSL in production
- Use `synchronize: true` in production
- Expose sensitive error messages

## Support

- **Neon Docs**: https://neon.tech/docs
- **TypeORM Docs**: https://typeorm.io
- **NestJS Docs**: https://docs.nestjs.com

## Checklist

- [ ] Created Neon PostgreSQL database
- [ ] Copied connection string with `?sslmode=require`
- [ ] Updated `.env` file with `DATABASE_URL`
- [ ] Installed dependencies (`npm install`)
- [ ] Started application (`npm run start:dev`)
- [ ] Tested health endpoint (`http://localhost:3000/health`)
- [ ] Verified database connection shows "connected"
- [ ] Checked database type shows "postgres"

✅ If all checks pass, your Neon PostgreSQL setup is complete!
