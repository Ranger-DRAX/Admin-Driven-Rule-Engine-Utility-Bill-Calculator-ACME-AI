# ACME AI - Electricity Bill Calculator

A full-stack web application for calculating electricity bills with an admin panel for rate configuration.

## 📋 Project Overview

This application provides:
- **User Panel**: Calculate electricity bills based on consumption units and consumer type
- **Admin Panel**: Manage electricity rates, view calculation history, and configure system settings
- **PDF Generation**: Download detailed bill reports
- **History Tracking**: Store and view past calculations

## 🏗️ Architecture

- **Backend**: NestJS (TypeScript) with TypeORM
- **Frontend**: React (TypeScript) with React Router
- **Database**: PostgreSQL (Supabase - Cloud Hosted)
- **Authentication**: JWT-based authentication
- **PDF Generation**: PDFKit (backend) & jsPDF (frontend)
- **Deployment**: Frontend (Vercel/Netlify), Backend (Render/Railway)

## 📁 Project Structure

```
ACME_AI/
├── backend/          # NestJS backend API
├── frontend/         # React frontend application
├── database/         # Database schema and seed files
├── docs/             # Project documentation
└── docker-compose.yml # Docker setup for PostgreSQL
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier)

### 1. Setup Database (Supabase)

**Step 1: Create Supabase Project**
1. Go to https://supabase.com/
2. Sign in and create a new project
3. Wait for database to initialize (~2 minutes)

**Step 2: Run SQL Scripts**
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste contents of `database/schema.sql`
4. Click **Run** to execute
5. Create another new query
6. Copy and paste contents of `database/seed.sql`
7. Click **Run** to execute

**Step 3: Get Connection Details**
1. Go to **Project Settings** → **Database**
2. Copy the **Connection String** (URI format)
3. Note down: Host, Database name, User, Password, Port

Your database is now ready with:
- ✅ 3 tables created (admins, configs, calculation_history)
- ✅ Default admin user (username: `admin`, password: `admin123`)
- ✅ Pre-configured electricity rates
- ✅ Sample calculation data

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm start
```

Frontend will run on `http://localhost:3001`

## 🔑 Default Admin Credentials

After running the seed script:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these credentials immediately in production!**

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [User Guide](docs/USER_GUIDE.md)
- [Requirements](docs/REQUIREMENTS.md)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Serve the 'build' folder with a static server
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Alternative format (if needed)
DATABASE_HOST=db.[YOUR-PROJECT-REF].supabase.co
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=[YOUR-PASSWORD]
DATABASE_NAME=postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=24h

# Server
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
```

## 🛠️ Tech Stack

### Backend
- NestJS - Progressive Node.js framework
- TypeORM - ORM for TypeScript
- PostgreSQL - Relational database
- Passport.js - Authentication middleware
- JWT - Token-based authentication
- PDFKit - PDF generation
- class-validator - Request validation

### Frontend
- React 18 - UI library
- TypeScript - Type safety
- React Router - Client-side routing
- Axios - HTTP client
- jsPDF - Client-side PDF generation
- CSS3 - Styling

## 📝 Features

### User Features
- ✅ Calculate electricity bill based on units consumed
- ✅ View detailed cost breakdown (base rate, taxes, surcharges)
- ✅ Download bill as PDF
- ✅ Responsive design for mobile and desktop

### Admin Features
- ✅ Secure admin authentication
- ✅ Manage electricity rates (CRUD operations)
- ✅ View calculation history
- ✅ Configure billing parameters
- ✅ Protected routes with role-based access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the ACME AI Fellowship Program.

## 👥 Authors

- **ACME AI Fellowship 5** - December 2025

## 📞 Support

For support, please refer to the [User Guide](docs/USER_GUIDE.md) or contact the development team.

---

**Built with ❤️ for ACME AI Fellowship Program**
